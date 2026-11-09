import unittest,sys,tempfile,json,tracemalloc,time,re
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from engine import Engine,BANK
class Clock:
    def __init__(self):self.t=100
    def __call__(self):return self.t
    def step(self,t):self.t+=t
class TestEngine(unittest.TestCase):
    def setUp(self):self.c=Clock();self.e=Engine(clock=self.c);self.e.command('start')
    def event(self,event='chat',uid='1',**data):self.e.command('event',dict(event=event,data=dict(userId=uid,nickname='Ana 🧠',**data)))
    def correct(self):return 'ABCD'[self.e.q['key']]
    def answer_phase(self):
        if self.e.phase=='memorize':self.c.step(5);self.e.advance()
    def test_unique_ids_and_first_vote(self):
        self.answer_phase();self.event(comment=self.correct());self.event(comment=self.correct());self.event(uid='2',comment=self.correct());self.assertEqual(len(self.e.votes),2);self.assertEqual(len(self.e.scores),2)
    def test_late_vote(self):
        self.answer_phase();self.c.step(100);self.event(comment=self.correct());self.assertFalse(self.e.votes)
    def test_pause_resume_stop(self):
        self.e.command('pause');left=self.e.remaining;self.c.step(99);self.e.advance();self.assertEqual(self.e.state,'paused');self.e.command('start');self.assertAlmostEqual(self.e.deadline-self.c(),left);self.e.command('stop');self.c.step(100);self.e.advance();self.assertEqual(self.e.state,'idle')
    def test_pause_during_reveal_prevents_ghost_round(self):
        self.answer_phase();self.e.settings['auto']=False;self.c.step(self.e.round_duration);self.e.advance();self.assertEqual(self.e.state,'reveal');self.assertEqual(self.e.snapshot()['total'],self.e.settings['interval']);self.e.command('pause');self.c.step(100);self.e.advance();self.assertEqual(self.e.state,'paused');self.e.command('start');self.c.step(self.e.settings['interval']);self.e.advance();self.assertEqual(self.e.state,'interval');self.c.step(2);self.e.advance();self.assertEqual(self.e.state,'ready');self.assertEqual(self.e.round,1)
    def test_gifts_combo_caps(self):
        self.answer_phase();self.e.command('settings',dict(roseId='5655',hintId='1'))
        self.event('gift',giftId='5655',giftType=1,repeatEnd=False,groupId='a');self.assertEqual(self.e.extra,0)
        self.event('gift',giftId='5655',giftType=1,repeatEnd=True,groupId='a');self.assertEqual(self.e.extra,3)
        self.c.step(2);self.event('gift',giftId='5655',giftType=1,repeatEnd=True,groupId='a');self.assertEqual(self.e.extra,3)
        for i in range(3):self.c.step(2);self.event('gift',uid=str(i+2),giftId='5655',giftType=0,msgId=str(i))
        self.assertEqual(self.e.extra,9)
        self.event('gift',uid='5',giftId='1',giftType=0);self.assertTrue(self.e.hint)
    def test_no_name_matching(self):
        self.answer_phase();self.event('gift',giftName='Rosa',giftId='unknown');self.assertEqual(self.e.extra,0)
    def test_no_paid_speed_bonus(self):
        self.answer_phase();self.e.settings['roseId']='1';self.c.step(10);self.event('gift',giftId='1');self.event(comment=self.correct());self.assertLess(self.e.scores['1']['points'],150)
    def test_no_answer_leak(self):
        self.assertNotIn('correct',self.e.snapshot()['q']);self.assertNotIn('solution',self.e.snapshot()['q'])
    def test_reset_clears_score(self):
        self.answer_phase();self.event(comment=self.correct());self.e.command('reset');self.assertEqual(self.e.round,0);self.assertFalse(self.e.scores);self.assertFalse(self.e.votes)
    def test_memory(self):
        while not self.e.q.get('memory'):self.e.start()
        self.assertFalse(self.e.snapshot()['q']['ans']);self.event(comment='A');self.assertFalse(self.e.votes);self.c.step(5);self.e.advance();self.assertEqual(len(self.e.snapshot()['q']['ans']),4);self.assertNotIn(self.e.q['sequence'],self.e.snapshot()['q']['q'])
    def test_bank_full_cycle(self):
        self.assertGreaterEqual(len(BANK),120);self.assertEqual(len({q['q']+q.get('sequence','') for q in BANK}),len(BANK));ids=[]
        self.e.index=0
        for _ in BANK:self.e.start();ids.append(self.e.q['id'])
        self.assertEqual(len(set(ids)),len(BANK))
        for q in BANK:self.assertEqual(len(set(q['ans'])),4);self.assertIn(q['key'],range(4));self.assertTrue(q['solution']);self.assertTrue(q['hint'])
    def test_mathematics_independently_calculated(self):
        for q in BANK:
            if q['cat']!='MATEMÁTICA':continue
            if '%' in q['q']:
                percent,base=map(int,re.findall(r'\d+',q['q']));answer=base*percent/100
            else:
                expr=q['q'].split('=')[0].replace('×','*').replace('÷','/').replace('−','-').replace('²','**2')
                self.assertRegex(expr,r'^[0-9+*/(). -]+$');answer=eval(expr,{'__builtins__':{}})
            self.assertEqual(float(q['ans'][q['key']]),answer)
    def test_settings_apply_next_round(self):
        self.answer_phase();duration=self.e.round_duration;self.e.command('settings',dict(duration=90));self.assertEqual(self.e.round_duration,duration);self.e.start();self.assertEqual(self.e.round_duration,90)
    def test_small_likes_memory_bounded(self):
        for i in range(5000):self.event('like',uid=str(i),likeCount=1)
        self.assertLessEqual(len(self.e.cooldowns),4096)
    def test_delayed_batch_does_not_enter_new_round(self):
        self.answer_phase();old=self.e.round;self.e.start();self.e.command('events',[dict(event='chat',round=old,data=dict(userId='u',comment='A'))]);self.assertFalse(self.e.votes)
    def test_saved_persistence_and_corruption(self):
        with tempfile.TemporaryDirectory() as td:
            p=Path(td)/'session.json';e=Engine(storage=p);e.scores={'1':dict(name='Ána',points=150)};e.settings['persist']=True;e.save();self.assertEqual(Engine(storage=p).scores,e.scores);p.write_text('bad');self.assertFalse(Engine(storage=p).scores)
    def test_moderation(self):
        self.answer_phase();self.e.settings['blocked']='1';self.event(comment=self.correct());self.assertFalse(self.e.votes);self.e.settings['blocked']='';self.e.settings['moderation']=True;self.event(comment=self.correct());self.assertFalse(self.e.votes)
    def test_one_hour_virtual_soak(self):
        tracemalloc.start();start=time.perf_counter()
        for second in range(3600):
            for i in range(6):
                self.event(uid=str(i),comment='ABCD'[i%4],msgId=f'{second}-{i}');self.event('follow',uid=str(second*6+i));self.event('gift',uid=str(second*6+i),giftId='x',msgId=f'g{second}-{i}')
            self.c.step(1);self.e.advance();self.e.snapshot()
            self.assertLessEqual(len(self.e.seen),4096);self.assertLessEqual(len(self.e.cooldowns),4096);self.assertLessEqual(len(self.e.alerts),12)
        current,peak=tracemalloc.get_traced_memory();tracemalloc.stop();self.assertGreater(self.e.round,50)
        print(json.dumps(dict(virtual_seconds=3600,events=64800,rounds=self.e.round,elapsed_seconds=round(time.perf_counter()-start,2),memory_current=current,memory_peak=peak),ensure_ascii=False))
if __name__=='__main__':unittest.main(verbosity=2)
