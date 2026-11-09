"""Ensaio em tempo real. Não acelera o relógio do jogo."""
import argparse,json,time,urllib.request,random
p=argparse.ArgumentParser();p.add_argument('--seconds',type=int,default=3600);p.add_argument('--url',default='http://127.0.0.1:8788');a=p.parse_args()
def command(action,data=None):
    raw=json.dumps(dict(action=action,data=data or {})).encode();r=urllib.request.Request(a.url+'/api/command',data=raw,headers={'Content-Type':'application/json'});return json.load(urllib.request.urlopen(r,timeout=10))
command('reset');command('settings',dict(duration=15,interval=4,auto=True));command('start');started=time.monotonic();count=0;maximum=0
while time.monotonic()-started<a.seconds:
    for i in range(4):
        command('event',dict(simulated=True,event='chat',data=dict(userId=str(i),nickname=f'Teste {i}',comment=random.choice('ABCD'),msgId=str(count))));count+=1
    s=json.load(urllib.request.urlopen(a.url+'/api/state',timeout=10));maximum=max(maximum,s['round'])
    if s['round']>0 and not isinstance(s['remaining'],(int,float)):raise RuntimeError('Cronômetro inválido')
    if count%240==0:print(json.dumps(dict(elapsed=round(time.monotonic()-started),events=count,round=s['round'])),flush=True)
    time.sleep(1)
print(json.dumps(dict(real_seconds=round(time.monotonic()-started,2),events=count,rounds=maximum,status='aprovado'),ensure_ascii=False))
command('stop')
