"""Síntese online opcional. Nenhum envio é feito ao importar este módulo."""
import asyncio
import hashlib
import math
import importlib.util
import os
import ssl
import threading
import time
from collections import OrderedDict

VOICES={'pt-BR-FranciscaNeural':'Francisca · natural feminina','pt-BR-AntonioNeural':'Antônio · natural masculina'}
class VoiceUnavailable(RuntimeError):pass
class VoiceBusy(RuntimeError):pass

class NaturalVoice:
    def __init__(self):
        self.lock=threading.Lock();self.gate=threading.BoundedSemaphore(1);self.cache=OrderedDict()
    def available(self):return importlib.util.find_spec('edge_tts') is not None
    def clear(self):
        with self.lock:self.cache.clear()
    def synthesize(self,text,voice='pt-BR-FranciscaNeural',rate=.94):
        text=str(text).strip()
        if not text or len(text)>220 or voice not in VOICES:raise ValueError('Fala ou voz inválida')
        rate=float(rate)
        if not math.isfinite(rate):raise ValueError('Velocidade inválida')
        rate=max(.7,min(1.4,rate))
        if not self.available():raise VoiceUnavailable('Instale a opção de voz natural e reinicie a arena.')
        key=hashlib.sha256((voice+'|'+str(rate)+'|'+text).encode()).hexdigest();now=time.monotonic()
        with self.lock:
            for old in list(self.cache):
                if now-self.cache[old][0]>120:del self.cache[old]
            if key in self.cache:return self.cache[key][1]
        if not self.gate.acquire(blocking=False):raise VoiceBusy('Outra fala está sendo preparada')
        try:
            data=asyncio.run(self.generate(text,voice,rate))
            with self.lock:
                self.cache[key]=(time.monotonic(),data)
                while len(self.cache)>16 or sum(len(v[1]) for v in self.cache.values())>3*1024*1024:self.cache.popitem(last=False)
            return data
        except (ValueError,VoiceUnavailable):raise
        except Exception as e:raise VoiceUnavailable('Não foi possível preparar a voz natural. Verifique conexão e serviço; a voz local pode ser escolhida manualmente.') from e
        finally:self.gate.release()
    async def generate(self,text,voice,rate):
        import edge_tts
        import edge_tts.communicate
        # Mantém verificação TLS e usa as autoridades confiadas pelo sistema/ambiente.
        context=ssl.create_default_context()
        if context.verify_mode!=ssl.CERT_REQUIRED or not context.check_hostname:raise VoiceUnavailable('Verificação TLS indisponível')
        edge_tts.communicate._SSL_CTX=context
        async def collect():
            tts=edge_tts.Communicate(text,voice=voice,rate=f'{round((rate-1)*100):+d}%',pitch='-2Hz',proxy=os.environ.get('HTTPS_PROXY') or os.environ.get('https_proxy'),connect_timeout=5,receive_timeout=8)
            chunks=[];size=0
            async for chunk in tts.stream():
                if chunk['type']=='audio':
                    size+=len(chunk['data'])
                    if size>1024*1024:raise VoiceUnavailable('Fala excedeu o limite de áudio')
                    chunks.append(chunk['data'])
            if not chunks:raise VoiceUnavailable('O serviço não retornou áudio')
            return b''.join(chunks)
        return await asyncio.wait_for(collect(),timeout=10)
