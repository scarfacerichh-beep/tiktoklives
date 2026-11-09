"""Falas locais e conquistas visuais, com memória e frequência limitadas."""
from collections import OrderedDict, deque
import re
import uuid

COSMETICS = ('Aura neon', 'Estrela da arena', 'Mente brilhante', 'Chuva de confetes')


def spoken_name(name):
    name = re.sub(r'https?://\S+|www\.\S+', '', str(name), flags=re.I)
    name = ''.join(c for c in name if c.isalnum() or c in ' _-')
    return ' '.join(name.split())[:24] or 'Participante'


class Interactions:
    def __init__(self, clock):
        self.clock = clock
        self.reset()

    def reset(self):
        self.epoch = uuid.uuid4().hex
        self.sequence = 0
        self.events = deque(maxlen=32)
        self.cooldowns = OrderedDict()
        self.window = deque(maxlen=4)

    def emit(self, kind, text, uid='', round=None, priority=1, cooldown=30):
        now = self.clock()
        key = (kind, uid)
        if uid and now - self.cooldowns.get(key, -1e9) < cooldown:
            return False
        while self.window and now - self.window[0] >= 1:
            self.window.popleft()
        if len(self.window) >= 4 and priority < 3:
            return False
        if uid:
            self.cooldowns[key] = now
            while len(self.cooldowns) > 4096:
                self.cooldowns.popitem(last=False)
        self.window.append(now)
        self.sequence += 1
        self.events.append(dict(id=self.sequence, kind=kind, text=text[:220],
                                round=round, priority=priority, at=now))
        return True

    def snapshot(self):
        now = self.clock()
        return dict(epoch=self.epoch, sequence=self.sequence, events=[
            {**{k: v for k, v in e.items() if k != 'at'}, 'age': now - e['at']}
            for e in self.events if now - e['at'] < 12
        ])
