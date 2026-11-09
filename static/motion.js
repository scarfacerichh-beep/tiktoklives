// Movimento guiado por eventos reais. Nenhum efeito decide votos ou pontuação.
export class ArenaMotion {
  constructor({root=document.querySelector('.canvas'),now=()=>performance.now()}={}) {
    this.root=root;this.now=now;this.previous=null;this.tickValue=null;this.previousArc=-1;this.lastPulse=new WeakMap();this.active=new Map();this.burstUntil=0;
    this.preference=matchMedia('(prefers-reduced-motion: reduce)');this.requested='vivid';
    this.preference.addEventListener('change',()=>this.setMode(this.requested));this.setMode('vivid');
  }
  setMode(requested){
    requested=['vivid','soft','off'].includes(requested)?requested:'vivid';this.requested=requested;const mode=this.preference.matches?'off':requested;
    if(this.mode===mode)return;this.mode=mode;this.root.dataset.motion=mode;
    if(mode==='off'){for(const animations of this.active.values())for(const a of animations)a.cancel();this.active.clear();document.getElementById('fxLayer').replaceChildren();}
  }
  animate(element,frames,options={}) {
    if(!element||this.mode==='off')return;
    const list=this.active.get(element)||[];
    while(list.length>=2)list.shift().cancel();
    const animation=element.animate(frames,{duration:this.mode==='soft'?550:400,easing:'cubic-bezier(.2,.8,.2,1)',...options});
    list.push(animation);this.active.set(element,list);
    animation.finished.catch(()=>{}).finally(()=>{const current=this.active.get(element);if(!current)return;const i=current.indexOf(animation);if(i>=0)current.splice(i,1);if(!current.length)this.active.delete(element);});
  }
  pulse(element){
    if(!element||this.now()-(this.lastPulse.get(element)??-Infinity)<380)return;
    this.lastPulse.set(element,this.now());this.animate(element,[{transform:'scale(1)'},{transform:'scale(1.045)',offset:.35},{transform:'scale(1)'}],{duration:360});
  }
  celebrate(kind='reveal'){
    if(this.mode==='off'||this.now()<this.burstUntil)return;
    const host=document.getElementById('fxLayer');if(host.children.length>=30)return;
    this.burstUntil=this.now()+1200;
    const count=Math.min(this.mode==='soft'?10:24,30-host.children.length),palette=['#4ff9e1','#ff6ac9','#a796ff','#ffe37d'];
    for(let i=0;i<count;i++){
      const piece=document.createElement('span');piece.className='fx-piece';
      for(const [key,value]of Object.entries({x:(12+Math.random()*76)+'%',y:kind==='reward'?'91%':'84%',dx:(Math.random()*380-190)+'px',dy:(-80-Math.random()*180)+'px',rotate:(Math.random()*480-240)+'deg',speed:(1.3+Math.random()*.5)+'s',size:(7+Math.random()*7)+'px',color:palette[i%palette.length]}))piece.style.setProperty('--'+key,value);
      host.append(piece);setTimeout(()=>piece.remove(),2000);
    }
  }
  render(s){
    this.setMode(s.settings.visualMotion||'vivid');
    const previous=this.previous,roundChanged=previous&&previous.round!==s.round;
    const phaseChanged=previous&&(previous.state!==s.state||previous.phase!==s.phase);
    for(const [key,value] of Object.entries({state:s.state,phase:s.phase,category:s.q?.cat||'ARENA'}))if(this.root.dataset[key]!==value)this.root.dataset[key]=value;
    const badge=document.getElementById('sceneBadge');
    const badgeText=s.state==='paused'?'PAUSADO':s.state==='reveal'?'RESPOSTA REVELADA':s.phase==='memorize'&&s.state==='running'?'MEMORIZE!':s.state==='running'?'SUA VEZ!':'PREPARE-SE';
    if(badge.textContent!==badgeText)badge.textContent=badgeText;
    const response=document.getElementById('responseCount');
    if(previous&&!roundChanged&&s.state==='running'&&s.count>previous.count){
      this.pulse(response);
      [...document.querySelectorAll('.answer')].forEach((box,i)=>{if(s.votes[i]>(previous.votes[i]||0)){this.pulse(box);box.dataset.received=String(s.votes[i]);}});
    }
    if(roundChanged||(phaseChanged&&previous.phase==='memorize'&&s.phase==='answer')){
      this.animate(document.getElementById('card'),[{transform:'translateY(16px)',opacity:.85},{transform:'translateY(0)',opacity:1}],{duration:480});
      [...document.querySelectorAll('.answer')].forEach((box,i)=>this.animate(box,[{transform:'translateY(10px)',opacity:.65},{transform:'translateY(0)',opacity:1}],{duration:380,delay:i*65}));
      this.animate(badge,[{transform:'scale(.85)'},{transform:'scale(1.06)',offset:.6},{transform:'scale(1)'}]);
    }
    if(previous&&s.state==='reveal'&&previous.state!=='reveal'&&previous.state!=='paused'){
      const correct=document.querySelector('.answer.correct');
      this.animate(correct,[{transform:'scale(1)'},{transform:'scale(1.035)',offset:.4},{transform:'scale(1)'}],{duration:650});this.celebrate();
    }
    if(previous){
      const oldPositions=new Map(previous.rank.map((row,i)=>[row.playerId||row.name,i]));
      [...document.querySelectorAll('.rank')].forEach((box,i)=>{
        const row=s.rank[i];if(!row)return;const oldIndex=oldPositions.get(row.playerId||row.name);
        if(oldIndex!==undefined&&oldIndex!==i){
          const distance=(oldIndex-i)*(box.offsetWidth+12);
          this.animate(box,[{transform:`translateX(${distance}px)`,opacity:.8},{transform:'translateX(0)',opacity:1}],{duration:600});
        }else if(previous.rank[i]?.hits!==row.hits)this.pulse(box);
      });
    }
    const alertKey=s.alert?JSON.stringify(s.alert):'';
    if(previous&&alertKey&&alertKey!==previous.alertKey&&['gift','reward'].includes(s.alert.kind)){
      this.celebrate(s.alert.kind);this.pulse(document.getElementById('lootIcon'));
    }
    const loot=document.getElementById('lootIcon');loot.hidden=s.alert?.kind!=='reward';
    this.previous={round:s.round,state:s.state,phase:s.phase,count:s.count,votes:[...s.votes],rank:s.rank.map(row=>({...row})),alertKey};
  }
  tick(left,s){
    const seconds=Math.ceil(left),arc=Math.round(1000*Math.max(0,Math.min(1,left/Math.max(1,s.total))));
    if(arc!==this.previousArc){document.getElementById('timerArc').style.strokeDashoffset=String(339.3*(1-arc/1000));this.previousArc=arc;}
    const urgent=s.state==='running'&&s.phase==='answer'&&left>0&&left<=5;
    const urgency=urgent?'low':'normal';if(this.root.dataset.urgency!==urgency)this.root.dataset.urgency=urgency;
    if(seconds!==this.tickValue){if(urgent)this.pulse(document.querySelector('.timer-dial'));this.tickValue=seconds;}
  }
}
