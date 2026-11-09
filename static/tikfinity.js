// Adaptador independente: nenhum efeito ou pontuação é decidido aqui.
export class TikFinity {
  constructor({event,status,url='ws://localhost:21213/'}) {Object.assign(this,{event,status,url});this.attempt=0;this.stopped=true;}
  start(){this.stop();this.stopped=false;this.connect();}
  stop(){this.stopped=true;clearTimeout(this.retry);if(this.socket){this.socket.onclose=null;this.socket.close();}}
  connect(){
    if(this.stopped)return;
    this.status('conectando');
    try{this.socket=new WebSocket(this.url);}catch{this.schedule();return;}
    this.socket.onopen=()=>{this.attempt=0;this.status('socket aberto · aguardando eventos');};
    this.socket.onmessage=e=>{
      if(typeof e.data!=='string'||e.data.length>150000)return;
      try{const p=JSON.parse(e.data);if(!p||typeof p.data!=='object'||!['chat','gift','follow','like','share'].includes(p.event))return;
        const d={};
        for(const key of ['userId','uniqueId','nickname','comment','msgId','messageId','transactionId','giftId','giftType','repeatEnd','repeatCount','groupId','comboId','likeCount']){
          const value=p.data[key];if(['string','number','boolean'].includes(typeof value))d[key]=typeof value==='string'?value.slice(0,key==='comment'?96:120):value;
        }
        this.status('eventos recebidos');this.event({event:p.event,data:d});
      }catch{this.status('payload inválido descartado');}
    };
    this.socket.onerror=()=>this.socket.close();
    this.socket.onclose=()=>this.schedule();
  }
  schedule(){if(this.stopped)return;const delay=Math.min(30000,1000*2**Math.min(this.attempt++,5))+Math.random()*250;this.status(`desconectado · nova tentativa em ${Math.ceil(delay/1000)}s`);this.retry=setTimeout(()=>this.connect(),delay);}
}
