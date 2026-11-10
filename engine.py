import time, threading, json, re
from collections import OrderedDict, deque
from pathlib import Path
from questions import BANK
from build_info import VERSION
from audience import Audience
from interactions import Interactions, spoken_name, COSMETICS
LETTERS='ABCD'
def clean(value,limit=48):
    return re.sub(r'[\x00-\x1f\x7f]', '', str(value or ''))[:limit]

class Engine:
    def __init__(self,clock=time.monotonic,storage=None):
        self.clock=clock;self.lock=threading.RLock();self.storage=Path(storage) if storage else None
        self.settings=dict(duration=20,interval=6,auto=True,level=1,persist=False,moderation=False,blocked='',roseId='',hintId='',specialId='',videoURL='',videoMuted=True,videoWhen='both',voiceEnabled=True,voiceNarration=True,voiceRate=.94,voiceVolume=.75,rewardsEnabled=True,visualMotion='vivid',visualPalette='party',tickerEnabled=True,tickerSpeed='normal',viewerReactions=True,voiceEngine='local',neuralVoice='pt-BR-FranciscaNeural')
        self.state='idle';self.phase='answer';self.round=0;self.index=0;self.q=None;self.deadline=0;self.remaining=0;self.extra=0;self.hint=False;self.votes={};self.counts=[0,0,0,0];self.scores={};self.seen=OrderedDict();self.cooldowns=OrderedDict();self.logs=deque(maxlen=60);self.alerts=deque(maxlen=12);self.alert=None;self.alert_until=0;self.revision=0;self.mode='REAL · AGUARDANDO EVENTOS';self.connection='desconectado';self.last_event=0;self.likes=0;self.frozen=None
        self.audience=Audience(clock);self.interactions=Interactions(clock);self.round_names={};self.pending_rewards=deque(maxlen=32);self.rewards=deque(maxlen=8);self.reward_sequence=0
        defaults=self.settings.copy()
        if self.storage and self.storage.exists():
            try:
                try:content=self.storage.read_text(encoding='utf-8')
                except UnicodeDecodeError:content=self.storage.read_text(encoding='cp1252');self.log('Ranking antigo convertido para UTF-8 ao próximo salvamento.')
                saved=json.loads(content);raw=saved.get('settings',{})
                for k,v in raw.items():
                    if k not in self.settings:continue
                    if k in ('duration','interval','level'):
                        lo,hi={'duration':(5,90),'interval':(3,20),'level':(1,3)}[k];self.settings[k]=max(lo,min(hi,int(v)))
                    elif k in ('auto','persist','moderation','videoMuted','voiceEnabled','voiceNarration','rewardsEnabled','tickerEnabled','viewerReactions'):self.settings[k]=v is True
                    elif k in ('voiceRate','voiceVolume'):
                        self.settings[k]=max(0.7,min(1.4,float(v))) if k=='voiceRate' else max(0,min(1,float(v)))
                    else:self.settings[k]=clean(v,2000 if k=='blocked' else 120)
                if self.settings['visualMotion'] not in ('vivid','soft','off'):self.settings['visualMotion']='vivid'
                if self.settings['visualPalette'] not in ('party','candy','aqua','sunset','electric'):self.settings['visualPalette']='party'
                if self.settings['voiceEngine'] not in ('local','neural'):self.settings['voiceEngine']='local'
                if self.settings['neuralVoice'] not in ('pt-BR-FranciscaNeural','pt-BR-AntonioNeural'):self.settings['neuralVoice']='pt-BR-FranciscaNeural'
                if self.settings['tickerSpeed'] not in ('slow','normal','fast'):self.settings['tickerSpeed']='normal'
                if self.settings['videoURL'] and not self.settings['videoURL'].startswith('/media/presenter.mp4?'):self.settings['videoURL']=''
                self.scores={clean(k,96):dict(name=clean(v['name']),points=max(0,min(int(v['points']),10**12)),hits=max(0,min(int(v.get('hits',0)),10**9)),streak=0,lastRound=None,rewards=max(0,min(int(v.get('rewards',0)),max(0,int(v.get('hits',0)))//5)),cosmetic=v.get('cosmetic','') if v.get('cosmetic') in ('neon','star','badge','confetti') else '') for k,v in list(saved.get('scores',{}).items())[:10000]} if self.settings['persist'] else {}
            except (ValueError,TypeError,KeyError,OSError,AttributeError):self.settings=defaults;self.scores={};self.log('Arquivo salvo inválido; sessão nova.')
    def log(self,msg):self.logs.appendleft(clean(msg,220))
    def changed(self):self.revision+=1
    def save(self):
        if not self.storage:return
        try:
            tmp=self.storage.with_suffix('.tmp');tmp.write_text(json.dumps(dict(settings=self.settings,scores=self.scores if self.settings['persist'] else {}),ensure_ascii=False),encoding='utf-8');tmp.replace(self.storage)
        except OSError:self.log('Não foi possível salvar; verifique permissão da pasta.')
    def notify(self,text,kind='social'):
        alert=dict(text=clean(text,130),kind=kind)
        if kind=='reward':
            if len(self.alerts)>=12:self.alerts.pop()
            self.alerts.appendleft(alert)
        elif len(self.alerts)<12:self.alerts.append(alert)
    def ranked(self):
        return [{**row,'playerId':uid} for uid,row in sorted(self.scores.items(),key=lambda item:(-item[1].get('hits',0),-item[1]['points'],item[1]['name']))[:10]]
    def speak(self,kind,text,**options):
        if self.settings['voiceEnabled'] and (self.settings['voiceNarration'] or kind not in ('round','reveal')):
            return self.interactions.emit(kind,text,**options)
    def reveal_interactions(self):
        winners=[self.round_names[uid] for uid,c in self.votes.items() if c==LETTERS[self.q['key']]]
        text=f"A resposta é {LETTERS[self.q['key']]}. {self.q['ans'][self.q['key']]}."
        if winners:text+=' '+', '.join(spoken_name(n) for n in winners[:2])+', parabéns pelo acerto!'
        else:text+=' Essa foi difícil! Vamos para a próxima.'
        self.speak('reveal',text,round=self.round,priority=2)
        for reward in self.pending_rewards:
            row=self.scores.get(reward['uid'])
            if row:row['cosmetic']=reward['style']
            self.rewards.appendleft({k:v for k,v in reward.items() if k!='uid'})
            self.notify(f"🎁 {reward['name']} abriu um baú visual: {reward['cosmetic']}!",'reward')
            self.speak('reward',f"{spoken_name(reward['name'])}, cinco acertos! Seu baú visual liberou {reward['cosmetic']}!",uid=str(reward['id']),priority=3,cooldown=0)
        self.pending_rewards.clear()
    def start(self):
        if self.pending_rewards:self.reveal_interactions()
        self.round+=1
        eligible=[q for q in BANK if q['level']>=self.settings['level']]
        self.q=eligible[self.index%len(eligible)];self.index+=1;self.phase='memorize' if self.q.get('memory') else 'answer';self.state='running';self.extra=0;self.hint=False;self.votes={};self.round_names={};self.counts=[0,0,0,0];self.quiet_prompt=False;self.answer_started_at=self.clock();self.round_duration=self.settings['duration'];self.remaining=5 if self.phase=='memorize' else self.settings['duration'];self.deadline=self.clock()+self.remaining;self.log(f'Rodada {self.round}: {self.q["cat"]}');self.changed()
        self.speak('round',f'Rodada {self.round}! '+('Memorize a sequência.' if self.phase=='memorize' else f'Você tem {self.round_duration} segundos. Comente A, B, C ou D.'),round=self.round,priority=2)
    def advance(self):
        now=self.clock()
        if self.state in ('running','reveal','interval') and now>=self.deadline:
            if self.state=='running' and self.phase=='memorize':
                self.phase='answer';self.answer_started_at=now;self.deadline=now+self.round_duration
                self.speak('round','A sequência sumiu! Qual era? Comente A, B, C ou D.',round=self.round,priority=2)
            elif self.state=='running':
                self.state='reveal';self.phase='reveal';self.deadline=now+self.settings['interval'];self.reveal_interactions();self.save()
            elif self.state=='reveal':
                self.state='interval';self.deadline=now+2
            elif self.settings['auto']:self.start()
            else:self.state='ready'
            self.changed()
        if self.state=='running' and self.phase=='answer' and not self.votes and not self.quiet_prompt and now-self.answer_started_at>=7 and self.deadline-now>5:
            self.quiet_prompt=True;self.speak('round','Qual será a resposta? Vale arriscar: A, B, C ou D!',round=self.round)
        if self.alert and now>=self.alert_until:self.alert=None;self.changed()
        if not self.alert and self.alerts:self.alert=self.alerts.popleft();self.alert_until=now+(5.5 if self.alert.get('kind')=='reward' else 2.8);self.changed()
    def command(self,action,data=None):
        data=data or {};self.advance();now=self.clock()
        if action=='start':
            if self.state=='paused':self.state=self.frozen;self.deadline=now+self.remaining
            elif self.state in ('idle','ready'):self.start()
        elif action=='pause' and self.state in ('running','reveal','interval'):
            self.remaining=max(0,self.deadline-now);self.frozen=self.state;self.state='paused'
        elif action=='next':self.start()
        elif action=='stop':self.state='idle';self.deadline=0;self.alerts.clear();self.alert=None
        elif action=='reset':
            self.state='idle';self.round=0;self.index=0;self.q=None;self.votes.clear();self.counts=[0,0,0,0];self.scores.clear();self.round_names.clear();self.pending_rewards.clear();self.rewards.clear();self.interactions.reset();self.audience.reset();self.alerts.clear();self.alert=None;self.save()
        elif action=='resetRank':self.scores.clear();self.pending_rewards.clear();self.rewards.clear();self.interactions.reset();self.save()
        elif action=='settings':
            for k in ('duration','interval','level'):
                if k in data:
                    lo,hi={'duration':(5,90),'interval':(3,20),'level':(1,3)}[k]
                    self.settings[k]=max(lo,min(hi,int(data[k])))
            for k in ('auto','persist','moderation','videoMuted','voiceEnabled','voiceNarration','rewardsEnabled','tickerEnabled','viewerReactions'):
                if k in data:self.settings[k]=data[k] is True
            for k in ('voiceRate','voiceVolume'):
                if k in data:self.settings[k]=max(0.7,min(1.4,float(data[k]))) if k=='voiceRate' else max(0,min(1,float(data[k])))
            for k in ('roseId','hintId','specialId','blocked','videoURL','videoWhen','visualMotion','visualPalette','tickerSpeed','voiceEngine','neuralVoice'):
                if k in data:self.settings[k]=clean(data[k],2000 if k=='blocked' else 120 if k=='videoURL' else 30)
            if self.settings['videoURL'] and not self.settings['videoURL'].startswith('/media/presenter.mp4?'):self.settings['videoURL']=''
            if self.settings['videoWhen'] not in ('both','idle','interval'):self.settings['videoWhen']='both'
            if self.settings['visualMotion'] not in ('vivid','soft','off'):self.settings['visualMotion']='vivid'
            if self.settings['visualPalette'] not in ('party','candy','aqua','sunset','electric'):self.settings['visualPalette']='party'
            if self.settings['tickerSpeed'] not in ('slow','normal','fast'):self.settings['tickerSpeed']='normal'
            if self.settings['voiceEngine'] not in ('local','neural'):self.settings['voiceEngine']='local'
            if self.settings['neuralVoice'] not in ('pt-BR-FranciscaNeural','pt-BR-AntonioNeural'):self.settings['neuralVoice']='pt-BR-FranciscaNeural'
            self.save()
        elif action=='status':self.connection=clean(data.get('status'),140);self.mode=clean(data.get('mode'),60)
        elif action=='event':self.event(data)
        elif action=='events' and isinstance(data,list):
            for payload in data[:200]:self.event(payload)
        self.changed()
    def dedup(self,key):
        if not key:return False
        if key in self.seen:return True
        self.seen[key]=self.clock()
        while len(self.seen)>4096:self.seen.popitem(last=False)
        return False
    def event(self,p):
        if not isinstance(p,dict) or not isinstance(p.get('data'),dict):return
        if p.get('event') in ('chat','gift') and p.get('round') is not None and p['round']!=self.round:return
        d=p['data'];t=p.get('event');now=self.clock();uid=clean(d.get('userId') or d.get('uniqueId') or d.get('nickname'),96);name=clean(d.get('nickname') or d.get('uniqueId') or 'Espectador',32)
        if not uid:return
        if uid in [x.strip() for x in self.settings['blocked'].split(',')]:return
        self.last_event=now
        if p.get('simulated'):self.mode='TESTE · EVENTOS SIMULADOS'
        else:self.mode='REAL · EVENTOS RECEBIDOS'
        mid=clean(d.get('msgId') or d.get('messageId') or d.get('transactionId'),120)
        if t=='chat':
            if self.settings['moderation']:return
            choice=str(d.get('comment','')).strip().upper()
            if not choice:return
            if not re.fullmatch(r'[ABCD][.!]?',choice):
                if mid and self.dedup('chat:'+mid):return
                if self.audience.add('comment',uid,name,cooldown=40):
                    self.notify(f'💬 {name}, bem-vindo! Escolha A, B, C ou D.');self.speak('comment',f'{spoken_name(name)}, obrigado pelo comentário! Escolha A, B, C ou D para jogar.',uid=uid,cooldown=40)
                return
            if self.state!='running' or self.phase!='answer' or now>=self.deadline:return
            if uid in self.votes or len(self.votes)>=20000:return
            if mid and self.dedup('chat:'+mid):return
            self.votes[uid]=choice[0];self.round_names[uid]=name;self.audience.add('vote',uid,name,round=self.round,choice=choice[0]);self.counts[LETTERS.index(choice[0])]+=1
            phrases=[f'{spoken_name(name)}, você tem certeza que é a {choice[0]}? Vamos conferir no final!',f'{spoken_name(name)} marcou {choice[0]}! Será que vem mais um acerto?',f'Anotei sua resposta, {spoken_name(name)}: letra {choice[0]}!']
            self.speak('vote',phrases[(self.round+len(self.votes)-2)%3],uid=uid,round=self.round,priority=2,cooldown=12)
            if choice[0]==LETTERS[self.q['key']]:
                left=max(0,self.deadline-now-self.extra);points=100+round(50*min(1,left/self.round_duration))
                if uid in self.scores or len(self.scores)<10000:
                    row=self.scores.setdefault(uid,dict(name=name,points=0,hits=0,streak=0,lastRound=None,rewards=0))
                    row['name']=name;row['points']+=points;row['hits']=row.get('hits',0)+1
                    row['streak']=row.get('streak',0)+1 if row.get('lastRound')==self.round-1 else 1;row['lastRound']=self.round
                    if self.settings['rewardsEnabled'] and row['hits']%5==0:
                        row['rewards']=row.get('rewards',0)+1;self.reward_sequence+=1
                        index=(sum(map(ord,uid))+row['rewards']-1)%len(COSMETICS);cosmetic=COSMETICS[index]
                        self.pending_rewards.append(dict(id=self.reward_sequence,uid=uid,name=name,hits=row['hits'],cosmetic=cosmetic,style=('neon','star','badge','confetti')[index]))
            elif uid in self.scores:
                self.scores[uid]['streak']=0;self.scores[uid]['lastRound']=self.round
        elif t=='gift':
            if str(d.get('giftType'))=='1' and d.get('repeatEnd') not in (True,1,'1','true'):return
            gift=clean(d.get('giftId'),30)
            combo=clean(d.get('groupId') or d.get('comboId'),100)
            key=f'gift:{uid}:{gift}:{combo}' if combo else ('gift:'+mid if mid else '')
            if self.dedup(key):return
            # Sem identificador único, limita retransmissões por usuário/presente.
            cd=f'{t}:{uid}:{gift}';last=self.cooldowns.get(cd,-1e9)
            if now-last<2:return
            self.cooldowns[cd]=now
            self.log(f'Presente ID {gift or "ausente"} · {name} · combo {clean(d.get("repeatCount"),8)}')
            active=self.state=='running' and self.phase=='answer' and now<self.deadline
            if gift and gift==self.settings['roseId'] and active and self.extra<9:
                self.extra+=3;self.deadline+=3;self.notify(f'🌹 {name}: +3s para todos! Teto +9s.','gift')
            elif gift and gift==self.settings['hintId'] and active and not self.hint:
                self.hint=True;self.notify(f'💡 {name} liberou a dica coletiva!','gift')
            else:self.notify(f'✨ Obrigado pelo presente, {name}!','gift')
            self.audience.add('gift',uid,name)
            self.speak('gift',f'{spoken_name(name)}, obrigado pelo presente! Você animou a arena!',uid=uid,priority=3,cooldown=15)
        elif t in ('follow','like','share'):
            cd=f'{t}:{uid}'
            if now-self.cooldowns.get(cd,-1e9)<30:return
            self.cooldowns[cd]=now
            if t=='like':self.likes+=max(1,min(1000,int(d.get('likeCount') or 1)))
            messages={'follow':f'{spoken_name(name)}, obrigado por seguir! Seja bem-vindo à arena!',
                      'like':f'{spoken_name(name)}, obrigado pela curtida! Bora para o próximo desafio!',
                      'share':f'{spoken_name(name)}, obrigado por compartilhar a live!'}
            labels={'follow':f'⭐ {name}, obrigado por seguir!','like':f'♥ {name}, obrigado pela curtida!','share':f'↗ {name}, obrigado por compartilhar!'}
            self.audience.add(t,uid,name)
            self.notify(labels[t]);self.speak(t,messages[t],uid=uid,priority=3 if t=='follow' else 1,cooldown=30)
        while len(self.cooldowns)>4096:self.cooldowns.popitem(last=False)
    def snapshot(self):
        now=self.clock();q=None
        if self.q:
            q={k:self.q[k] for k in ('id','cat','q','ans','level')}
            if self.phase=='memorize':q['q']='MEMORIZE: '+self.q['sequence'];q['ans']=[]
            if self.state=='reveal' or (self.state=='paused' and self.frozen=='reveal'):
                q['correct']=self.q['key'];q['solution']=self.q['solution']
            if self.hint:q['hint']=self.q['hint']
        counts=self.counts.copy()
        active_state=self.frozen if self.state=="paused" else self.state
        total=self.settings["interval"] if active_state=="reveal" else 2 if active_state=="interval" else 5 if self.phase=="memorize" else getattr(self,"round_duration",self.settings["duration"])+self.extra
        return dict(version=VERSION,audience=self.audience.snapshot(),revision=self.revision,state=self.state,phase=self.phase,round=self.round,q=q,remaining=self.remaining if self.state=='paused' else max(0,self.deadline-now) if self.state in ('running','reveal','interval') else 0,total=total,votes=counts,count=len(self.votes),rank=self.ranked(),speech=self.interactions.snapshot(),rewards=list(self.rewards),settings=self.settings,alert=self.alert,logs=list(self.logs),mode=self.mode,connection=self.connection,eventAge=now-self.last_event if self.last_event else None)
