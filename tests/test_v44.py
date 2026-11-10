import unittest
from unittest.mock import patch,AsyncMock
from audience import Audience
from natural_voice import NaturalVoice,VoiceUnavailable,VoiceBusy
from engine import Engine
class V44(unittest.TestCase):
 def test_visual_feed_bounded_cooldown_and_reset(self):
  now=[100];a=Audience(lambda:now[0]);epoch=a.epoch
  self.assertTrue(a.add('like','u','Ana',cooldown=30));self.assertFalse(a.add('like','u','Ana',cooldown=30))
  for i in range(50):a.add('vote',str(i),'Bia',round=1,choice='D')
  self.assertEqual(len(a.snapshot()['events']),12);self.assertNotIn('at',a.snapshot()['events'][0]);now[0]+=13;self.assertFalse(a.snapshot()['events']);a.reset();self.assertNotEqual(a.epoch,epoch)
 def test_voice_off_keeps_real_comment_and_vote_reactions(self):
  e=Engine();e.command('settings',{'voiceEnabled':False});e.command('start')
  while e.phase=='memorize':e.command('next')
  for comment in ['oi','D','D']:e.command('event',{'event':'chat','data':{'userId':'u','nickname':'Ana','comment':comment}})
  events=e.snapshot()['audience']['events'];self.assertEqual([x['kind'] for x in events],['comment','vote']);self.assertEqual(e.snapshot()['count'],1);self.assertNotIn('correct',events[-1])
 def test_voice_cache_bounded_and_validation(self):
  v=NaturalVoice()
  with patch.object(v,'available',return_value=True),patch.object(v,'generate',new_callable=AsyncMock,return_value=b'audio') as generate:
   self.assertEqual(v.synthesize('Teste'),b'audio');v.synthesize('Teste');self.assertEqual(generate.call_count,1)
   for i in range(30):v.synthesize('Teste '+str(i))
   self.assertLessEqual(len(v.cache),16);v.clear();self.assertEqual(len(v.cache),0)
   with self.assertRaises(ValueError):v.synthesize('x'*221)
   with self.assertRaises(ValueError):v.synthesize('Teste',voice='invalid')
 def test_dependency_absence_and_concurrency(self):
  v=NaturalVoice()
  with patch.object(v,'available',return_value=False):
   with self.assertRaises(VoiceUnavailable):v.synthesize('Teste')
  with patch.object(v,'available',return_value=True):
   v.gate.acquire()
   with self.assertRaises(VoiceBusy):v.synthesize('Teste')
   v.gate.release()
class HTTPV44(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  import servidor,threading
  from http.server import ThreadingHTTPServer
  cls.module=servidor;cls.server=ThreadingHTTPServer(('127.0.0.1',0),servidor.Handler);cls.port=cls.server.server_port
  cls.thread=threading.Thread(target=cls.server.serve_forever,daemon=True);cls.thread.start()
 @classmethod
 def tearDownClass(cls):cls.server.shutdown();cls.server.server_close()
 def request(self,path,data=None):
  import http.client,json
  c=http.client.HTTPConnection('127.0.0.1',self.port);c.request('GET' if data is None else 'POST',path,None if data is None else json.dumps(data));r=c.getresponse();result=(r.status,r.read());c.close();return result
 def test_health_and_same_install_probe(self):
  import json
  code,raw=self.request('/api/health');self.assertEqual(code,200);self.assertEqual(json.loads(raw)['version'],'4.4.0');self.assertTrue(self.module.probe_existing(self.port))
 def test_online_requires_consent_owner_lease_and_setting(self):
  from unittest.mock import patch
  m=self.module;m.voice_owner='';m.voice_until=0;m.engine.command('settings',{'voiceEngine':'neural'})
  speech={'owner':'test-owner','consent':True,'text':'Teste genérico'}
  with patch.object(m.natural_voice,'synthesize',return_value=b'MP3') as synth:
   self.assertEqual(self.request('/api/tts',speech)[0],403);self.assertEqual(synth.call_count,0)
   self.request('/api/voice-lease',{'owner':'test-owner','online':False});self.assertEqual(self.request('/api/tts',speech)[0],403)
   self.request('/api/voice-lease',{'owner':'test-owner','online':True});self.assertEqual(self.request('/api/tts',{**speech,'consent':False})[0],403)
   self.assertEqual(self.request('/api/tts',speech),(200,b'MP3'))
   self.request('/api/voice-lease',{'owner':'test-owner','release':True});self.assertEqual(self.request('/api/tts',speech)[0],403)
  m.engine.command('settings',{'voiceEngine':'local'})
 def test_launcher_reuses_current_install(self):
  import subprocess,sys
  r=subprocess.run([sys.executable,'servidor.py','--port',str(self.port),'--auto-port'],capture_output=True,text=True,timeout=5)
  self.assertEqual(r.returncode,0);self.assertIn('já está aberta',r.stdout)
 def test_launcher_occupied_port_fails_clearly_without_auto(self):
  import subprocess,sys
  r=subprocess.run([sys.executable,'servidor.py','--port',str(self.port)],capture_output=True,text=True,timeout=5)
  self.assertEqual(r.returncode,1);self.assertIn('Não foi possível iniciar',r.stdout)
