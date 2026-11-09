// Voz local do navegador: fila limitada, sem APIs pagas ou leitura livre do chat.
export class ArenaSpeech {
  constructor({synth=globalThis.speechSynthesis,Utterance=globalThis.SpeechSynthesisUtterance,onStatus=()=>{},now=()=>Date.now(),gap=600,authorize=null}={}) {
    Object.assign(this,{synth,Utterance,onStatus,now,gap,authorize});
    this.generation=0;this.enabled=false;this.queue=[];this.current=null;this.epoch=null;this.lastId=0;this.rate=1.05;this.volume=.8;this.voiceURI='';this.state=null;
  }
  voices(){return (this.synth?.getVoices()||[]).filter(v=>/^pt(?:-|_)/i.test(v.lang)&&v.localService!==false).sort((a,b)=>Number(/^pt[-_]BR$/i.test(b.lang))-Number(/^pt[-_]BR$/i.test(a.lang)));}
  enable(){
    if(!this.synth||!this.Utterance){this.onStatus('Este navegador não oferece síntese de voz. Use Edge no Windows.');return false;}
    if(!this.voices().length){this.onStatus('Nenhuma voz local em português disponível. Instale uma voz pt-BR no Windows e reabra o navegador.');return false;}
    this.enabled=true;this.onStatus('Voz ativada · aguardando interações');return true;
  }
  configure({voiceRate=1.05,voiceVolume=.8}={}){this.rate=Math.max(.7,Math.min(1.4,Number(voiceRate)||1.05));this.volume=Math.max(0,Math.min(1,Number(voiceVolume)||0));}
  cancelCurrent(){this.generation++;clearTimeout(this.watchdog);if(this.current){this.current=null;this.synth?.cancel();}}
  stop(message='Voz desativada'){this.enabled=false;this.queue=[];clearTimeout(this.next);this.next=null;this.cancelCurrent();this.onStatus(message);}
  allowed(item){
    if(item.kind==='demo')return true;
    if(this.now()-item.received+item.age*1000>=12000)return false;
    if(item.round!=null&&item.round!==this.state?.round)return false;
    if(item.kind==='vote')return this.state?.state==='running'&&this.state?.phase==='answer';
    if(item.kind==='round')return this.state?.state==='running';
    if(item.kind==='reveal')return this.state?.state==='reveal';
    return this.state?.state!=='paused';
  }
  ingest(state){
    this.state=state;this.configure(state.settings);
    if(!state.settings.voiceEnabled&&this.enabled)this.stop('Voz desativada nas configurações');
    if(this.current&&!this.allowed(this.current))this.cancelCurrent();
    this.queue=this.queue.filter(e=>this.allowed(e));
    const speech=state.speech;if(!speech)return;
    if(this.epoch!==speech.epoch){this.epoch=speech.epoch;this.lastId=speech.sequence;this.queue=[];this.cancelCurrent();return;}
    for(const e of speech.events){if(e.id<=this.lastId)continue;this.lastId=e.id;if(this.enabled)this.enqueue(e);}
    this.lastId=Math.max(this.lastId,speech.sequence);
  }
  enqueue(event){
    if(!this.enabled)return;
    const item={...event,received:this.now(),age:Number(event.age)||0};if(!this.allowed(item))return;
    if(this.queue.length>=4){const lowest=this.queue.reduce((best,e,i,a)=>e.priority<a[best].priority?i:best,0);if(item.priority<this.queue[lowest].priority)return;this.queue.splice(lowest,1);}
    this.queue.push(item);this.pump();
  }
  test(){this.enqueue({kind:'demo',text:'Teste de voz. A arena está pronta! Vamos jogar?',priority:3,age:0});}
  pump(){
    if(!this.enabled||this.current||this.next||this.authorizing)return;
    this.queue=this.queue.filter(e=>this.allowed(e));if(!this.queue.length)return;
    this.queue.sort((a,b)=>b.priority-a.priority);const item=this.queue.shift();
    if(this.authorize){
      this.authorizing=true;const generation=this.generation;
      Promise.resolve(this.authorize()).then(acquired=>{
        this.authorizing=false;
        if(this.generation!==generation){this.pump();return;}
        if(!acquired){this.stop('Outra aba assumiu a voz. Ative o áudio em apenas um painel.');return;}
        if(!this.enabled||this.generation!==generation||!this.allowed(item)){this.pump();return;}
        this.play(item);
      }).catch(()=>{this.authorizing=false;this.stop('Não foi possível confirmar o controle de áudio. Reative a voz.');});
      return;
    }
    this.play(item);
  }
  play(item){
    const voices=this.voices(),voice=voices.find(v=>v.voiceURI===this.voiceURI)||voices[0];
    if(!voice){this.stop('A voz local deixou de estar disponível. Reabra o navegador.');return;}
    this.current=item;const utterance=new this.Utterance(item.text);utterance.lang=voice.lang;utterance.voice=voice;utterance.rate=this.rate;utterance.volume=this.volume;
    const done=()=>{if(this.current!==item)return;this.current=null;clearTimeout(this.watchdog);this.onStatus('Voz ativada · aguardando interações');this.next=setTimeout(()=>{this.next=null;this.pump();},this.gap);};
    utterance.onend=done;utterance.onerror=e=>{if(this.current!==item)return;if(e.error==='not-allowed'){this.stop('Áudio bloqueado. Clique em Ativar voz novamente.');return;}done();this.onStatus('Falha ao reproduzir uma fala · verifique a saída de áudio');};
    this.onStatus('Falando: '+item.text);this.watchdog=setTimeout(()=>{if(this.current===item){this.current=null;this.synth.cancel();this.pump();}},16000);
    try{this.synth.speak(utterance);}catch{done();this.onStatus('Não foi possível reproduzir a fala. Verifique as vozes do navegador.');}
  }
}
