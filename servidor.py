"""Servidor local autoritativo. Python 3.11+, sem dependências."""
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlparse,unquote
import os,json,time,threading,argparse,webbrowser,sys
from engine import Engine
ROOT=Path(__file__).resolve().parent
os.chdir(ROOT)
engine=Engine(storage=ROOT/'session.json')
condition=threading.Condition()
lease_owner=""
lease_until=0
voice_owner=""
voice_until=0
class Handler(SimpleHTTPRequestHandler):
    protocol_version='HTTP/1.1'
    def log_message(self,*args):pass
    def end_headers(self):
        self.send_header('Cache-Control','no-store');self.send_header('X-Content-Type-Options','nosniff');super().end_headers()
    def json_response(self,status,data):
        raw=json.dumps(data,ensure_ascii=False).encode();self.send_response(status);self.send_header('Content-Type','application/json; charset=utf-8');self.send_header('Content-Length',str(len(raw)));self.end_headers();self.wfile.write(raw)
    def do_GET(self):
        path=unquote(urlparse(self.path).path)
        if path=='/api/state':
            with engine.lock:return self.json_response(200,engine.snapshot())
        if path=='/api/events':
            self.send_response(200);self.send_header('Content-Type','text/event-stream');self.send_header('Connection','keep-alive');self.end_headers();revision=-1
            try:
                while True:
                    with engine.lock:
                        current=engine.revision;snap=engine.snapshot() if revision!=current else None
                    if snap:
                        self.wfile.write(('data: '+json.dumps(snap,ensure_ascii=False)+'\n\n').encode());revision=current
                    else:self.wfile.write(b': heartbeat\n\n')
                    self.wfile.flush()
                    with condition:
                        updated=condition.wait_for(lambda:engine.revision!=revision,timeout=10)
                    if not updated:revision=-1
            except (BrokenPipeError,ConnectionResetError,TimeoutError):return
        elif path=='/media/presenter.mp4':
            super().do_GET()
        elif path=='/' or path=='/index.html' or path.startswith('/static/'):
            if '..' in path:return self.send_error(404)
            super().do_GET()
        else:self.send_error(404)
    def do_POST(self):
        global lease_owner,lease_until,voice_owner,voice_until
        origin=self.headers.get('Origin')
        if origin and origin!=f'http://{self.headers.get("Host")}':return self.json_response(403,{'error':'Origem não permitida'})
        if urlparse(self.path).path=='/api/video':
            try:
                size=int(self.headers.get('Content-Length','0'))
                if not 0<size<=250*1024*1024:raise ValueError()
                media=ROOT/'media';media.mkdir(exist_ok=True);tmp=media/'presenter.tmp'
                with tmp.open('wb') as f:
                    left=size
                    while left:
                        block=self.rfile.read(min(left,1024*1024))
                        if not block:raise ValueError()
                        f.write(block);left-=len(block)
                with tmp.open('rb') as f:
                    if b'ftyp' not in f.read(64):tmp.unlink();raise ValueError()
                tmp.replace(media/'presenter.mp4')
                return self.json_response(200,{'url':'/media/presenter.mp4?v='+str(time.time_ns())})
            except (ValueError,OSError):return self.json_response(400,{'error':'Use MP4 válido de até 250 MB.'})
        if urlparse(self.path).path=='/api/voice-lease':
            try:
                size=int(self.headers.get('Content-Length','0'))
                if not 0<size<300:raise ValueError()
                data=json.loads(self.rfile.read(size));owner=str(data['owner'])[:60]
                with engine.lock:
                    if data.get('release') and voice_owner==owner:voice_owner='';voice_until=0
                    acquired=not data.get('release') and (voice_owner==owner or time.monotonic()>voice_until)
                    if acquired:voice_owner=owner;voice_until=time.monotonic()+25
                return self.json_response(200,{'acquired':acquired})
            except (ValueError,KeyError,TypeError):return self.json_response(400,{'error':'Identificador inválido'})
        if urlparse(self.path).path=='/api/lease':
            try:
                size=int(self.headers.get('Content-Length','0'))
                if not 0<size<200:raise ValueError()
                owner=str(json.loads(self.rfile.read(size))['owner'])[:60]
                with engine.lock:
                    acquired=owner==lease_owner or time.monotonic()>lease_until
                    if acquired:lease_owner=owner;lease_until=time.monotonic()+10
                return self.json_response(200,{'acquired':acquired})
            except (ValueError,KeyError,TypeError):return self.json_response(400,{'error':'Identificador inválido'})
        if urlparse(self.path).path!='/api/command':return self.json_response(404,{'error':'Endereço desconhecido'})
        try:
            size=int(self.headers.get('Content-Length','0'))
            if not 0<size<=150000:raise ValueError('Payload inválido')
            payload=json.loads(self.rfile.read(size))
            with engine.lock:engine.command(payload['action'],payload.get('data'));snap={'ok':True} if payload['action'] in ('event','events') else engine.snapshot()
            if payload['action'] not in ('event','events'):
                with condition:condition.notify_all()
            self.json_response(200,snap)
        except (ValueError,KeyError,TypeError):self.json_response(400,{'error':'Comando inválido'})
def ticker():
    published=-1
    while True:
        with engine.lock:
            engine.advance();changed=published!=engine.revision;published=engine.revision
        if changed:
            with condition:condition.notify_all()
        time.sleep(.1)
def main():
    parser=argparse.ArgumentParser();parser.add_argument('--port',type=int,default=8788);parser.add_argument('--open',action='store_true');args=parser.parse_args()
    try:server=ThreadingHTTPServer(('127.0.0.1',args.port),Handler)
    except OSError as e:print(f'Não foi possível iniciar na porta {args.port}: {e}. Feche outra instância ou use --port 8789.');return 1
    threading.Thread(target=ticker,daemon=True).start();url=f'http://127.0.0.1:{args.port}/';print('INTERALIVES QI ARENA STUDIO 4.1\nPainel: '+url+'\nVisor: '+url+'?live=1',flush=True)
    if args.open:webbrowser.open(url)
    try:server.serve_forever()
    except KeyboardInterrupt:server.server_close()
    return 0
if __name__=='__main__':sys.exit(main())
