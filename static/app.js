import {TikFinity} from './tikfinity.js';
import {ArenaPrompts} from './prompts.js';
import {ArenaMotion} from './motion.js';
import {ArenaSpeech} from './speech.js';
const narrator=new ArenaSpeech({authorize:()=>voiceLease(),onStatus:message=>{const el=document.getElementById('voiceStatus');if(el)el.textContent=message;}});
const $=id=>document.getElementById(id),live=new URLSearchParams(location.search).has('live'),letters='ABCD';
let serverConnected=false;let snapshot=null,arrived=0,lastQ='',lastRank='',alertKey='',audio,mode='real',adapterStatus='',lastStatusSent=0;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const motion=new ArenaMotion();
const prompts=new ArenaPrompts();
async function command(action,data={}){
 try{const r=await fetch('/api/command',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,data})});if(!r.ok)throw Error(r.status);return await r.json();}
 catch(e){$('sessionStatus').textContent='Servidor indisponível · tentando reconectar';}
}
function hitsLabel(n){return n+' '+(n===1?'acerto':'acertos');}
function text(id,value){const el=$(id);if(el&&el.textContent!==String(value))el.textContent=value;}
function resize(){document.documentElement.style.setProperty('--frame-scale',Math.min(innerWidth/1080,innerHeight/1920));}
if(live){document.body.classList.add('broadcast');resize();addEventListener('resize',resize);}
function beep(){if(live||!$('sfx').checked)return;try{audio??=new AudioContext();audio.resume();const o=audio.createOscillator(),g=audio.createGain();g.gain.setValueAtTime(.025,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.12);o.frequency.value=850;o.connect(g).connect(audio.destination);o.start();o.stop(audio.currentTime+.13);}catch{}}
function burst(){motion.celebrate('reward');}
function render(s){
 serverConnected=true;narrator.ingest(s);snapshot=s;arrived=performance.now();const q=s.q;const running=s.state==='running',reveal=q?.correct!==undefined;
 text('sessionStatus','Jogo: '+({idle:'aguardando início',running:'rodada em andamento',paused:'pausado',reveal:'resposta revelada',interval:'intervalo',ready:'aguardando próxima rodada'}[s.state]||s.state));
 text('socketStatus','TikFinity: '+s.connection+(s.eventAge===null?' · sem eventos':` · último evento há ${Math.floor(s.eventAge)}s`));
 text('viewerStatus','Visor: sincronizado pelo servidor local (inclusive OBS)');
 text('rotatingMessage',s.mode.startsWith('TESTE')?'TESTE · SIMULAÇÃO':(s.connection.includes('eventos recebidos')?'COMENTE A, B, C OU D':'JOGUE GRÁTIS · A / B / C / D'));
 text('lastWinner',s.settings.rewardsEnabled?'🎁 Baú visual a cada 5 acertos':'Mais acertos → mais alto');
 text('roundBadge','#'+String(s.round).padStart(3,'0'));text('category',q?.cat||'QI ARENA');text('difficulty','NÍVEL '+(q?.level||s.settings.level));
 text('headline',s.state==='idle'?'Seu próximo desafio':s.state==='interval'?'Respire. Vem mais!':reveal?'Confira a solução':s.phase==='memorize'?'Guarde a sequência':'Desafio da vez');
 text('subhead',s.state==='idle'?'Leia → comente A/B/C/D → acerte e pontue':reveal?'Confira a alternativa destacada e a explicação.':s.state==='paused'?'Uma pausa rápida. Já voltamos.':'Sua primeira resposta vale. Participação gratuita.');
 text('question',s.state==='idle'?'Pronto para jogar?':reveal?('Resposta '+letters[q.correct]+' · '+q.ans[q.correct]+'\n'+q.solution):(q?.q||'Aguarde o desafio'));
 $('question').className='questionText'+(($('question').textContent.length>30)?' smaller':$('question').textContent.length<17?' large':'');
 text('responseCount',s.count+' resposta'+(s.count===1?'':'s'));
 text('phase',({idle:'AGUARDANDO INÍCIO',paused:'PAUSADO',reveal:'RESPOSTA '+letters[q?.correct],interval:'PRÓXIMA RODADA',ready:'AGUARDANDO OPERADOR'}[s.state])||(s.phase==='memorize'?'MEMORIZE · 5s':'COMENTE A / B / C / D'));
 text('hint',q?.hint?'💡 '+q.hint:reveal?'✓ '+s.count+' participantes · próxima rodada em instantes':'⚡ Acertos: 100 a 150 pontos • mais rápido, mais pontos');
 document.querySelector('.answer-title').textContent=reveal?'RESPOSTA CORRETA EM DESTAQUE':'QUAL ALTERNATIVA ESTÁ CERTA?';
 document.querySelector('.card-label').textContent=reveal?'SOLUÇÃO DO DESAFIO':'SUA MISSÃO';
 document.querySelector('.sec').textContent=(reveal||s.state==='interval')?'até a próxima rodada':'segundos restantes';
 document.querySelector('.gift.rose small').textContent=s.settings.roseId?'+3s • teto +9s':'Efeito visual';
 document.querySelector('.gift.tiktok small').textContent=s.settings.hintId?'1 dica / rodada':'Efeito visual';
 text('microcopy',reveal?'ENTENDEU? VEM MAIS UM DESAFIO!':s.phase==='memorize'?'Memorize: as opções aparecem em 5 segundos.':'COMENTE A / B / C / D · JOGUE GRÁTIS');
 const signature=JSON.stringify([q?.id,s.phase,s.state==='idle']);
 if(signature!==lastQ){lastQ=signature;$('answers').replaceChildren();if(q&&s.state!=='idle')q.ans.forEach((a,i)=>{const box=document.createElement('div');box.className='answer';box.dataset.index=i;for(const [cls,val] of [['letter',letters[i]],['answer-text',a],['vote-number','0']]){const el=document.createElement('span');el.className=cls;el.textContent=val;box.append(el);}$('answers').append(box);});}
 [...$('answers').children].forEach((box,i)=>{box.classList.toggle('correct',reveal&&q.correct===i);box.querySelector('.vote-number').textContent=s.votes[i];box.style.setProperty('--votes',(s.count?100*s.votes[i]/s.count:0)+'%');});
 const questionNode=$('question');questionNode.style.fontSize='';
 let fitSize=parseFloat(getComputedStyle(questionNode).fontSize);
 while((questionNode.scrollHeight>questionNode.clientHeight+1||questionNode.scrollWidth>questionNode.clientWidth+1)&&fitSize>38){fitSize-=2;questionNode.style.fontSize=fitSize+'px';}
 const rankSignature=JSON.stringify(s.rank);if(rankSignature!==lastRank){lastRank=rankSignature;[...$('leaderboard').children].forEach((el,i)=>{el.classList.toggle('has-reward',!!s.rank[i]?.cosmetic);el.dataset.cosmetic=s.rank[i]?.cosmetic||'';el.querySelector('strong').textContent=(s.rank[i]?.name?(s.rank[i].name):null)||['Seu nome aqui','Participe','Comente!'][i];el.querySelector('.pts').textContent=hitsLabel(s.rank[i]?.hits||0)+' · '+(s.rank[i]?.points||0)+' pts';});$('top10').replaceChildren();for(const r of s.rank){const li=document.createElement('li');li.textContent=r.name+' · '+hitsLabel(r.hits||0)+' · '+r.points+' pts'+(r.rewards?' · 🎁 '+r.rewards+' baú(s)':'');$('top10').append(li);}}
 if(s.alert){const key=JSON.stringify(s.alert);if(alertKey!==key){alertKey=key;text('toastText',s.alert.text);$('toast').classList.remove('visible');void $('toast').offsetWidth;$('toast').classList.add('visible');$('toast').classList.toggle('reward-toast',s.alert.kind==='reward');beep();}}else{$('toast').classList.remove('visible');alertKey='';}
 document.querySelector('.arenaFooter').style.visibility=s.alert?'hidden':'visible';
 motion.render(s);prompts.render(s);text('motionStatus',motion.preference.matches?'Seu sistema está com movimento reduzido; a arena respeita essa preferência.':motion.mode==='off'?'Movimento desligado. As cores e o jogo continuam ativos.':'Animações acompanham votos, rodadas, ranking e conquistas reais.');
 text('log',s.logs.join('\n'));
 const video=$('presenter');if(s.settings.videoURL&&video.dataset.serverURL!==s.settings.videoURL){video.src=s.settings.videoURL;video.dataset.serverURL=s.settings.videoURL;}else if(!s.settings.videoURL&&video.dataset.serverURL){video.removeAttribute('src');delete video.dataset.serverURL;}video.muted=s.settings.videoMuted;const when=s.settings.videoWhen;video.classList.toggle('show',!!video.src&&((s.state==='idle'&&when!=='interval')||(['reveal','interval'].includes(s.state)&&when!=='idle')));if(video.src){if(video.classList.contains('show'))video.play().catch(()=>{});else video.pause();}
 if(!live&&document.activeElement?.closest('.panel')===null){for(const k of ['duration','interval','level','roseId','hintId','specialId','blocked','voiceRate','voiceVolume','visualMotion','visualPalette','tickerSpeed'])$(k).value=s.settings[k];for(const k of ['auto','persist','moderation','voiceEnabled','voiceNarration','rewardsEnabled','tickerEnabled'])$(k).checked=s.settings[k];}
}
const stream=new EventSource('/api/events');stream.onmessage=e=>{try{render(JSON.parse(e.data));}catch(err){console.error(err);}};
stream.onerror=()=>{serverConnected=false;narrator.stop('Servidor desconectado · reative a voz após reconectar');text('phase','RECONECTANDO AO SERVIDOR');text('sessionStatus','Servidor local desconectado · reconexão automática');};
function tick(){if(snapshot&&serverConnected){let left=snapshot.remaining;if(['running','reveal','interval'].includes(snapshot.state))left=Math.max(0,left-(performance.now()-arrived)/1000);text('timer',String(Math.ceil(left)).padStart(2,'0'));$('progress').style.width=Math.max(0,Math.min(100,100*left/snapshot.total))+'%';document.querySelector('.canvas').classList.toggle('danger',snapshot.state==='running'&&left<=5);motion.tick(left,snapshot);prompts.tick(left);if(snapshot.state==='running'&&left===0)text('phase','ENCERRANDO RESPOSTAS');}requestAnimationFrame(tick);}requestAnimationFrame(tick);
$('openViewer').onclick=()=>window.open('/?live=1','_blank','noopener');
for(const id of ['start','pause','next','stop','reset','resetRank'])$(id).onclick=()=>command(id);
async function saveSettings(){const data={};for(const k of ['duration','interval','level'])data[k]=Number($(k).value);for(const k of ['roseId','hintId','specialId','blocked','visualMotion','visualPalette','tickerSpeed'])data[k]=$(k).value;for(const k of ['auto','persist','moderation','voiceEnabled','voiceNarration','rewardsEnabled','tickerEnabled'])data[k]=$(k).checked;data.voiceRate=Number($('voiceRate').value);data.voiceVolume=Number($('voiceVolume').value);await command('settings',data);}
for(const id of ['duration','interval','level','auto','persist','moderation','blocked','voiceEnabled','voiceNarration','voiceRate','voiceVolume','rewardsEnabled','visualMotion','visualPalette','tickerEnabled','tickerSpeed'])$(id).onchange=saveSettings;$('saveIds').onclick=saveSettings;
function simulate(event,data={}){return command('event',{event,simulated:true,data:{userId:$('tester').value||'Visitante',nickname:$('tester').value||'Visitante',msgId:crypto.randomUUID(),...data}});}
for(const c of letters)$('test'+c).onclick=()=>simulate('chat',{comment:c});
$('testRose').onclick=()=>simulate('gift',{giftId:snapshot?.settings.roseId||'SEM_MAPEAMENTO',giftType:0});
$('testTikTok').onclick=()=>simulate('gift',{giftId:snapshot?.settings.hintId||'SEM_MAPEAMENTO',giftType:0});
$('testGift').onclick=()=>simulate('gift',{giftId:snapshot?.settings.specialId||'cosmetic',giftType:0});
$('testFollow').onclick=()=>simulate('follow');$('testLike').onclick=()=>simulate('like',{likeCount:1});$('testComment').onclick=()=>simulate('chat',{comment:'Olá, pessoal!'});
async function uploadVideo(file){
 text('videoStatus','Carregando MP4 local…');
 try{if(file.size>250*1024*1024)throw Error('Limite de 250 MB');const r=await fetch('/api/video',{method:'POST',headers:{'Content-Type':'video/mp4'},body:file});const data=await r.json();if(!r.ok)throw Error(data.error);await command('settings',{videoURL:data.url,videoMuted:$('videoMute').checked,videoWhen:$('videoWhen').value});text('videoStatus','MP4 disponível no painel e no visor.');}catch(e){text('videoStatus','Falha: '+e.message);}
}
$('videoFile').onchange=()=>{const file=$('videoFile').files[0];if(file)uploadVideo(file);};
$('videoMute').onchange=()=>command('settings',{videoMuted:$('videoMute').checked});
$('videoWhen').onchange=()=>command('settings',{videoWhen:$('videoWhen').value});
$('removeVideo').onclick=()=>command('settings',{videoURL:''});
let adapter,leaseTimer;const owner=crypto.randomUUID();
const eventQueue=[];let draining=false;
function enqueue(p){if(eventQueue.length>=20000){text('socketStatus','Capacidade atingida: 20.000 eventos pendentes.');return;}const bindRound=p.event==='gift'||(p.event==='chat'&&/^[A-D][.!]?$/.test(String(p.data?.comment||'').trim().toUpperCase()));eventQueue.push({...p,...(bindRound?{round:snapshot?.round}:{}),simulated:mode==='mock'});}
async function drain(){if(draining||!eventQueue.length)return;draining=true;const batch=eventQueue.splice(0,100);const sent=await command('events',batch);if(!sent)eventQueue.unshift(...batch.slice(0,20000-eventQueue.length));draining=false;if(sent&&eventQueue.length)queueMicrotask(drain);}
if(!live)setInterval(drain,50);
async function lease(){try{const r=await fetch('/api/lease',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({owner})});const {acquired}=await r.json();if(acquired&&!adapter){adapter=new TikFinity({url:mode==='mock'?'ws://localhost:21214/':'ws://localhost:21213/',event:enqueue,status:status=>{adapterStatus=status;const now=Date.now();if(now-lastStatusSent>2000||status!=='eventos recebidos'){lastStatusSent=now;command('status',{status,mode:mode==='mock'?'TESTE · SIMULADOR WEBSOCKET':'REAL · AGUARDANDO EVENTOS'});}}});adapter.start();}else if(!acquired&&adapter){adapter.stop();adapter=null;}}catch{}}
if(!live){lease();leaseTimer=setInterval(lease,4000);$('source').onchange=()=>{mode=$('source').value;if(adapter){adapter.stop();adapter=null;}lease();};}

let voiceHeartbeat=null;const voiceOwner=crypto.randomUUID();
function refreshVoices(){const select=$('voiceChoice'),saved=select.value||localVoice();select.replaceChildren();const voices=narrator.voices();if(!voices.length){const o=document.createElement('option');o.value='';o.textContent='Nenhuma voz local em português';select.append(o);}for(const voice of voices){const o=document.createElement('option');o.value=voice.voiceURI;o.textContent=voice.name+' · '+voice.lang;select.append(o);}if(voices.some(v=>v.voiceURI===saved))select.value=saved;narrator.voiceURI=select.value;}
function localVoice(){try{return localStorage.getItem('arena-voice')||'';}catch{return '';}}
$('voiceChoice').onchange=()=>{narrator.voiceURI=$('voiceChoice').value;try{localStorage.setItem('arena-voice',narrator.voiceURI);}catch{}};
if(!live){refreshVoices();globalThis.speechSynthesis?.addEventListener('voiceschanged',refreshVoices);}
async function voiceLease(release=false){try{const r=await fetch('/api/voice-lease',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({owner:voiceOwner,release}),signal:AbortSignal.timeout(3000)});return (await r.json()).acquired;}catch{return false;}}
$('enableVoice').onclick=async()=>{
 if(!snapshot?.settings.voiceEnabled){text('voiceStatus','Marque Responder por voz antes de ativar.');return;}
 if(!await voiceLease()){text('voiceStatus','Outra aba está com a voz ativa. Silencie nela e tente novamente.');return;}
 refreshVoices();if(!narrator.enable()){await voiceLease(true);return;}narrator.configure(snapshot.settings);narrator.test();clearInterval(voiceHeartbeat);voiceHeartbeat=setInterval(async()=>{if(!narrator.enabled){clearInterval(voiceHeartbeat);await voiceLease(true);}else if(!await voiceLease()){narrator.stop('Voz interrompida: outra aba assumiu o áudio.');clearInterval(voiceHeartbeat);}},2000);
};
$('muteVoice').onclick=()=>{narrator.stop();clearInterval(voiceHeartbeat);voiceLease(true);};
addEventListener('pagehide',()=>{narrator.stop();clearInterval(voiceHeartbeat);if(!live)navigator.sendBeacon('/api/voice-lease',new Blob([JSON.stringify({owner:voiceOwner,release:true})],{type:'application/json'}));});
