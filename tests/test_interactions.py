import unittest,sys,tempfile,json
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from engine import Engine
from interactions import spoken_name
from test_engine import Clock

class TestInteractions(unittest.TestCase):
    def setUp(self):self.clock=Clock();self.e=Engine(clock=self.clock);self.e.command('start');self.answer_phase()
    def answer_phase(self):
        if self.e.phase=='memorize':self.clock.step(5);self.e.advance()
    def event(self,t='chat',uid='u1',name='João 🧠',**data):
        self.e.command('event',{'event':t,'data':dict(userId=uid,nickname=name,**data)})
    def voices(self,kind):return [e for e in self.e.interactions.events if e['kind']==kind]
    def test_social_event_is_not_discarded_at_round_boundary(self):
        old=self.e.round;self.e.start();self.e.command('event',{'event':'like','round':old,'data':{'userId':'social','nickname':'Lúcia','likeCount':1}});self.assertIn('Lúcia',self.voices('like')[0]['text'])
    def test_single_like_says_name_and_thanks(self):
        self.event('like',likeCount=1);self.assertIn('João',self.voices('like')[0]['text']);self.assertIn('obrigado',self.voices('like')[0]['text']);self.assertIn('João',self.e.alerts[0]['text'])
    def test_like_cooldown_and_follow_separate(self):
        for _ in range(10):self.event('like',likeCount=1)
        self.event('follow');self.assertEqual(len(self.voices('like')),1);self.assertEqual(len(self.voices('follow')),1);self.clock.step(31);self.event('like',likeCount=1);self.assertEqual(len(self.voices('like')),2)
    def test_acknowledges_first_vote_without_revealing_accuracy(self):
        self.event(comment='D');self.event(comment='D');v=self.voices('vote');self.assertEqual(len(v),1);self.assertIn('João',v[0]['text']);self.assertIn('D',v[0]['text']);self.assertNotIn('acertou',v[0]['text']);self.assertNotIn('correta',v[0]['text'])
    def test_free_comment_greeting_does_not_read_untrusted_message(self):
        self.event(comment='palavrão ou link www.exemplo.com');self.assertFalse(self.e.votes);speech=self.voices('comment')[0]['text'];self.assertIn('João',speech);self.assertNotIn('palavrão',speech);self.assertNotIn('exemplo.com',speech)
    def test_moderation_applies_before_voice(self):
        self.e.settings['blocked']='u1';self.event('follow');self.event('like',likeCount=1);self.event(comment='A');self.assertFalse(self.voices('follow'));self.assertFalse(self.voices('like'));self.assertFalse(self.voices('vote'))
    def test_rank_prioritizes_hits_over_speed_points(self):
        self.e.scores={'1':dict(name='Mais acertos',points=200,hits=2),'2':dict(name='Mais pontos',points=900,hits=1)};self.assertEqual(self.e.snapshot()['rank'][0]['name'],'Mais acertos')
    def test_five_hits_release_one_cosmetic_only_on_reveal(self):
        for i in range(5):
            if i:self.e.start();self.answer_phase()
            self.event(comment='ABCD'[self.e.q['key']]);self.event(comment='ABCD'[self.e.q['key']])
            if i==4:self.assertFalse(self.e.rewards);self.assertEqual(self.e.scores['u1']['rewards'],1)
            self.clock.step(self.e.deadline-self.clock());self.e.advance()
        self.assertEqual(self.e.scores['u1']['hits'],5);self.assertEqual(len(self.e.rewards),1);self.assertIn('visual',self.voices('reward')[0]['text']);self.e.advance();self.assertEqual(len(self.e.rewards),1)
    def test_disabled_rewards_do_not_create_chests(self):
        self.e.settings['rewardsEnabled']=False
        for i in range(5):
            if i:self.e.start();self.answer_phase()
            self.event(comment='ABCD'[self.e.q['key']]);self.clock.step(1)
        self.assertFalse(self.e.pending_rewards);self.assertEqual(self.e.scores['u1']['rewards'],0)
    def test_duplicate_message_ids_never_grant_extra_hits(self):
        self.event(comment='ABCD'[self.e.q['key']],msgId='one');self.e.start();self.answer_phase();self.event(comment='ABCD'[self.e.q['key']],msgId='one');self.assertEqual(self.e.scores['u1']['hits'],1)
    def test_voice_and_queues_bounded_under_spam(self):
        for i in range(5000):self.event('follow',uid=str(i))
        self.assertLessEqual(len(self.e.interactions.events),32);self.assertLessEqual(len(self.e.interactions.cooldowns),4096);self.assertLessEqual(len(self.e.alerts),12)
    def test_reconnect_snapshot_expires_old_speech(self):
        self.event('follow');self.clock.step(13);self.assertEqual(self.e.snapshot()['speech']['events'],[])
    def test_mute_and_narration_settings(self):
        self.e.settings['voiceEnabled']=False;before=self.e.interactions.sequence;self.event('like',likeCount=1);self.assertEqual(self.e.interactions.sequence,before)
    def test_spoken_name_removes_links_and_control_characters(self):
        self.assertEqual(spoken_name('João 🧠 https://spam.test\n'), 'João')
    def test_legacy_ranking_migration_preserves_points_without_inventing_hits(self):
        with tempfile.TemporaryDirectory() as td:
            p=Path(td)/'session.json';p.write_text(json.dumps(dict(settings=dict(persist=True),scores={'u':dict(name='Ana',points=300)})))
            row=Engine(storage=p).scores['u'];self.assertEqual(row['points'],300);self.assertEqual(row['hits'],0)
    def test_quiet_chat_gets_one_invitation_without_stopping_round(self):
        before=len(self.voices('round'));self.clock.step(8);self.e.advance();self.assertEqual(len(self.voices('round')),before+1);self.clock.step(1);self.e.advance();self.assertEqual(len(self.voices('round')),before+1);self.assertEqual(self.e.state,'running')
    def test_reward_notice_is_prioritized_over_social_spam(self):
        for i in range(12):self.e.notify('Obrigado '+str(i))
        self.e.notify('Baú visual conquistado','reward');self.assertEqual(len(self.e.alerts),12);self.assertEqual(self.e.alerts[0]['kind'],'reward')
    def test_unicode_names_saved_as_utf8(self):
        with tempfile.TemporaryDirectory() as td:
            self.e.storage=Path(td)/'session.json';self.e.settings['persist']=True;self.event(name='João 🧠',comment='ABCD'[self.e.q['key']]);self.e.save();self.assertIn('João 🧠',self.e.storage.read_bytes().decode('utf-8'))
    def test_legacy_windows_file_keeps_accented_names(self):
        with tempfile.TemporaryDirectory() as td:
            p=Path(td)/'session.json';p.write_text(json.dumps(dict(settings=dict(persist=True),scores={'u':dict(name='João',points=300)}),ensure_ascii=False),encoding='cp1252')
            self.assertEqual(Engine(storage=p).scores['u']['name'],'João')
    def test_disabling_rewards_does_not_invent_chests_on_restart(self):
        with tempfile.TemporaryDirectory() as td:
            p=Path(td)/'session.json';p.write_text(json.dumps(dict(settings=dict(persist=True),scores={'u':dict(name='Ana',points=500,hits=5,rewards=0)})))
            self.assertEqual(Engine(storage=p).scores['u']['rewards'],0)
    def test_hits_persist_and_reset_clears_cosmetics(self):
        with tempfile.TemporaryDirectory() as td:
            self.e.storage=Path(td)/'session.json';self.e.settings['persist']=True
            self.event(comment='ABCD'[self.e.q['key']]);self.e.save();restored=Engine(storage=self.e.storage);self.assertEqual(restored.scores['u1']['hits'],1)
            self.e.command('reset');self.assertFalse(self.e.scores);self.assertFalse(self.e.rewards);self.assertFalse(self.e.interactions.events)

if __name__=='__main__':unittest.main(verbosity=2)
