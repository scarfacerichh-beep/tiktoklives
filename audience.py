"""Atividade visual real, independente de a voz estar ativada."""
from collections import deque, OrderedDict
import uuid

class Audience:
    def __init__(self,clock):
        self.clock=clock;self.reset()
    def reset(self):
        self.epoch=uuid.uuid4().hex;self.sequence=0;self.events=deque(maxlen=12);self.cooldowns=OrderedDict()
    def add(self,kind,uid,name,round=None,choice='',cooldown=0):
        now=self.clock();key=(kind,uid)
        if cooldown and now-self.cooldowns.get(key,-1e9)<cooldown:return False
        if cooldown:
            self.cooldowns[key]=now
            while len(self.cooldowns)>4096:self.cooldowns.popitem(last=False)
        self.sequence+=1;self.events.append(dict(id=self.sequence,kind=kind,name=name[:32],round=round,choice=choice[:1],at=now));return True
    def snapshot(self):
        now=self.clock()
        return dict(epoch=self.epoch,sequence=self.sequence,events=[{**{k:v for k,v in row.items() if k!='at'},'age':now-row['at']} for row in self.events if now-row['at']<12])
