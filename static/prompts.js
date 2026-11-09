// Convites editoriais: não simulam audiência, votos ou presentes recebidos.
export function promptsFor(s,left=s.remaining){
  if(s.state==='paused')return ['PAUSA RÁPIDA · JÁ VOLTAMOS','O relógio está parado. Aguarde a retomada.'];
  if(s.state==='idle'||s.state==='ready')return ['BORA JOGAR? É GRÁTIS!','Como jogar: leia · escolha uma letra · participe','Siga a arena para acompanhar os desafios'];
  if(s.state==='running'&&s.phase==='memorize')return ['MEMORIZE A SEQUÊNCIA!','Guarde os números. As opções já vão aparecer.','Agora é concentração: observe a ordem!'];
  if(s.state==='running'&&left<=0)return ['RESPOSTAS ENCERRADAS!','Vamos conferir a solução do desafio.'];
  if(s.state==='running'){
    if(left<=5)return ['ÚLTIMOS SEGUNDOS!','Já escolheu? Comente A, B, C ou D.','Vale sua primeira resposta nesta rodada.'];
    const list=['COMENTE A, B, C OU D!','Curtiu o desafio? Deixe uma curtida!','Convide alguém para jogar com você!','Siga a arena para acompanhar mais desafios!','Acertou? Suba no ranking por acertos.'];
    if(s.settings?.rewardsEnabled)list.push('5 acertos = um baú VISUAL gratuito!');
    const start=Math.max(0,(Number(s.round)||1)-1)%list.length;
    return [...list.slice(start),...list.slice(0,start)];
  }
  if(s.state==='reveal')return ['CONFIRA A RESPOSTA!','Veja a alternativa destacada e a explicação.','Acertou? Seu resultado conta no ranking.','Curtiu jogar? Convide alguém para o próximo!'];
  return ['VEM AÍ OUTRO DESAFIO!','Prepare sua próxima resposta.','Jogar é grátis · presentes são opcionais.'];
}
export function paletteFor(choice,round){
  const options=['candy','aqua','sunset','electric'];
  if(options.includes(choice))return choice;
  return options[Math.max(0,(Number(round)||1)-1)%options.length];
}
export class ArenaPrompts {
  constructor({root=document.querySelector('.canvas'),track=document.getElementById('tickerTrack')}={}){
    this.root=root;this.track=track;this.key='';this.builds=0;this.state=null;
  }
  render(s,left=s.remaining){
    this.state=s;
    const palette=paletteFor(s.settings.visualPalette,s.round);
    if(this.root.dataset.palette!==palette)this.root.dataset.palette=palette;
    const simulated=String(s.mode).startsWith('TESTE'),mode=document.getElementById('feedMode');
    if(mode.hidden===simulated)mode.hidden=!simulated;if(mode.textContent!=='TESTE')mode.textContent='TESTE';
    const urgent=s.state==='running'&&s.phase==='answer'?(left<=0?'ended':left<=5?'urgent':'answer'):s.phase;
    this.bucket=urgent;
    const key=JSON.stringify([s.state,urgent,s.round,s.settings.tickerEnabled,s.settings.tickerSpeed]);
    if(key===this.key)return;this.key=key;
    const messages=promptsFor(s,left),host=document.getElementById('interactionTicker');
    const staticMode=s.settings.tickerEnabled===false||s.state==='paused';
    host.dataset.static=String(staticMode);host.dataset.context=s.state==='running'?urgent:s.state;
    document.getElementById('tickerLabel').textContent=s.state==='paused'?'☕ PAUSA':s.phase==='memorize'&&s.state==='running'?'🧠 FOCO':'⚡ INTERAJA';
    const group=document.createElement('div');group.className='ticker-group';
    messages.forEach((message,i)=>{const chip=document.createElement('span');chip.className='ticker-chip tone-'+i%4;const dot=document.createElement('i');dot.setAttribute('aria-hidden','true');const text=document.createElement('span');text.textContent=message;chip.append(dot,text);group.append(chip);});
    const duplicate=group.cloneNode(true);duplicate.setAttribute('aria-hidden','true');
    this.track.style.animation='none';this.track.replaceChildren(group,duplicate);
    const speed={slow:34,normal:48,fast:62}[s.settings.tickerSpeed]||48;
    this.track.style.setProperty('--crawl-duration',Math.max(10,Math.min(90,group.scrollWidth/speed))+'s');
    void this.track.offsetWidth;this.track.style.animation='';
    this.builds++;this.track.dataset.builds=String(this.builds);
  }
  tick(left){const s=this.state;if(!s||s.state!=='running'||s.phase!=='answer')return;const bucket=left<=0?'ended':left<=5?'urgent':'answer';if(bucket!==this.bucket)this.render(s,left);}
}
