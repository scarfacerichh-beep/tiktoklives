"""Simulador WebSocket local RFC6455, sem dependências. POST /emit, /disconnect."""
from http.server import ThreadingHTTPServer,BaseHTTPRequestHandler
import hashlib,base64,json,struct,threading,time
clients=set();lock=threading.Lock()
def frame(data):
    raw=json.dumps(data,ensure_ascii=False).encode();n=len(raw)
    return bytes([0x81,n]) + raw if n<126 else bytes([0x81,126])+struct.pack('!H',n)+raw
class Handler(BaseHTTPRequestHandler):
    def log_message(self,*args):pass
    def do_GET(self):
        if self.headers.get('Upgrade','').lower()!='websocket':self.send_error(400);return
        key=self.headers.get('Sec-WebSocket-Key','');accept=base64.b64encode(hashlib.sha1((key+'258EAFA5-E914-47DA-95CA-C5AB0DC85B11').encode()).digest()).decode()
        self.send_response(101);self.send_header('Upgrade','websocket');self.send_header('Connection','Upgrade');self.send_header('Sec-WebSocket-Accept',accept);self.end_headers()
        with lock:clients.add(self.connection)
        try:
            while self.connection.recv(1024):pass
        except OSError:pass
        finally:
            with lock:clients.discard(self.connection)
    def do_POST(self):
        n=int(self.headers.get('Content-Length','0'))
        if n>150000:self.send_error(413);return
        data=json.loads(self.rfile.read(n) or b'{}')
        with lock:
            for c in list(clients):
                try:
                    if self.path=='/disconnect':c.shutdown(2);c.close();clients.discard(c)
                    elif self.path=='/emit':c.sendall(frame(data))
                except OSError:clients.discard(c)
        raw=json.dumps({'clients':len(clients)}).encode();self.send_response(200);self.send_header('Content-Length',str(len(raw)));self.end_headers();self.wfile.write(raw)
if __name__=='__main__':
    print('SIMULAÇÃO: WebSocket localhost:21214 · POST /emit e /disconnect',flush=True)
    ThreadingHTTPServer(('127.0.0.1',21214),Handler).serve_forever()
