// Reações só surgem de atividade recebida; sem visitantes inventados.
export class ArenaAudience {
  constructor({motion,now=()=>performance.now()}={}){this.motion=motion;this.now=now;this.epoch=null;this.lastId=0;this.until=0;this.sequence=0;this.timer=null;this.lastEffects=-Infinity;}
  clear(){clearTimeout(this.timer);document.getElementById('arenaBuddy').dataset.mood='idle';document.getElementById('buddyBubble').textContent='BORA!';document.getElementById('lastVisitor').textContent='JOGUE GRÁTIS';document.getElementById('visitorAvatar').textContent='✦';document.querySelectorAll('.visitor-token').forEach(e=>e.remove());this.until=0;}
  render(s){
    const feed=s.audience;if(!feed)return;
    if(this.epoch!==feed.epoch){this.epoch=feed.epoch;this.lastId=feed.sequence;this.clear();return;}
    if(!s.settings.viewerReactions){this.lastId=feed.sequence;this.clear();return;}
    const fresh=feed.events.filter(e=>e.id>this.lastId&&e.age<8&&(e.kind!=='vote'||(e.round===s.round&&s.state==='running'&&s.phase==='answer')));
    this.lastId=Math.max(this.lastId,feed.sequence);
    if(!fresh.length)return;const item=fresh.at(-1);this.sequence++;const token=this.sequence;
    const name=item.name||'Participante',messages={vote:`${name} · ${item.choice}`,like:`${name} curtiu ♥`,follow:`${name} chegou!`,share:`${name} compartilhou`,gift:`${name} animou a arena!`,comment:`Oi, ${name}!`};
    document.getElementById('lastVisitor').textContent=messages[item.kind]||name;
    document.getElementById('visitorAvatar').textContent=Array.from(name).find(c=>/[\p{L}\p{N}]/u.test(c))?.toUpperCase()||'✦';
    const bubbles={vote:'ANOTADO!',like:'VALEU! ♥',follow:'CHEGOU! ✦',share:'BOA! ↗',gift:'UHUU! ✦',comment:'OI! ✦'};
    const buddy=document.getElementById('arenaBuddy');buddy.dataset.mood=item.kind;document.getElementById('buddyBubble').textContent=bubbles[item.kind]||'BORA!';
    this.motion.pulse(document.getElementById('visitorChip'));this.motion.pulse(buddy);
    if(this.motion.mode!=='off'&&this.now()-this.lastEffects>=600){
      this.lastEffects=this.now();for(const e of fresh.slice(-3))if(e.kind==='vote')this.voteEffect(e);
      if(item.kind==='follow'||item.kind==='like')this.motion.animate(buddy,[{transform:'rotate(0)'},{transform:'rotate(-7deg) translateY(-6px)',offset:.3},{transform:'rotate(6deg)',offset:.65},{transform:'rotate(0)'}],{duration:700});
    }
    clearTimeout(this.timer);this.timer=setTimeout(()=>{if(this.sequence===token)this.clear();},4200);
  }
  voteEffect(item){
    const host=document.querySelector(`.answer[data-index="${'ABCD'.indexOf(item.choice)}"]`);if(!host||document.querySelectorAll('.visitor-token').length>=8)return;
    const dot=document.createElement('span');dot.className='visitor-token';dot.textContent=Array.from(item.name).find(c=>/[\p{L}\p{N}]/u.test(c))||'✦';dot.setAttribute('aria-hidden','true');host.append(dot);
    this.motion.animate(dot,[{transform:'translateY(14px) scale(.6)',opacity:0},{transform:'translateY(-8px) scale(1.1)',opacity:1,offset:.45},{transform:'translateY(-26px) scale(.9)',opacity:0}],{duration:950});setTimeout(()=>dot.remove(),1050);
  }
}
