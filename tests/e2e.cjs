const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const base=process.env.ARENA_URL||'http://127.0.0.1:8790',out=path.join(__dirname,'../evidence');
const bank=JSON.parse(require('node:child_process').execFileSync(process.env.PYTHON||'python3',['-c','import json;from questions import BANK;print(json.dumps(BANK))'],{cwd:path.join(__dirname,'..')}));
const run=Date.now()+"-";let checks=0;function ok(value,message){assert(value,message);checks++;console.log('OK',message);}
async function post(action,data={}){const r=await fetch(base+'/api/command',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,data})});assert.equal(r.status,200);return r.json();}
async function state(){return (await fetch(base+'/api/state')).json();}
async function emit(event,data){data={...data};if(data.msgId)data.msgId=run+data.msgId;if(data.groupId)data.groupId=run+data.groupId;const r=await fetch('http://localhost:21214/emit',{method:'POST',body:JSON.stringify({event,data})});assert.equal(r.status,200);}
async function poll(fn,timeout=7000){let start=Date.now();while(Date.now()-start<timeout){if(await fn())return;await new Promise(r=>setTimeout(r,70));}throw Error('Tempo esgotado: '+fn.toString());}
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM||'/usr/bin/chromium',args:['--no-sandbox']});const errors=[];
 const panel=await browser.newPage({viewport:{width:1536,height:1120}});panel.on('pageerror',e=>errors.push(e.message));await panel.goto(base);
 await post('reset');await post('settings',{auto:false,duration:90,roseId:'5655',hintId:'1',specialId:'999'});await panel.selectOption('#source','mock');
 await poll(async()=>(await state()).connection.includes('socket aberto'));
 await panel.click('#start');await poll(async()=>(await state()).state==='running');let s=await state();if(s.phase==='memorize'){await new Promise(r=>setTimeout(r,5200));s=await state();}
 const correct='ABCD'[bank.find(q=>q.id===s.q.id).key];
 for(let i=1;i<=3;i++)await emit('chat',{userId:'u'+i,nickname:i<3?'Ana 🧠':'<img src=x onerror=alert(1)>',comment:correct,msgId:'m'+i});
 await emit('chat',{userId:'u1',nickname:'Mudou nome',comment:correct,msgId:'duplicate-vote'});
 await poll(async()=>(await state()).count===3);s=await state();ok(s.rank.length===3,'IDs distintos com mesmo apelido + uma resposta por conta');ok(s.rank.every(r=>r.points<=150&&r.points>=100),'Pontuação e rapidez consistentes');
 const viewer=await browser.newPage({viewport:{width:1080,height:1920}});viewer.on('pageerror',e=>errors.push(e.message));await viewer.goto(base+'/?live=1');await poll(async()=>(await viewer.locator('#responseCount').textContent())==='3 respostas');
 ok(await viewer.locator('.panel').isHidden(),'Visor não mostra controles administrativos');ok(await viewer.locator('#leaderboard img').count()===0,'Nickname malicioso renderizado como texto');
 await emit('gift',{userId:'g1',nickname:'Lu 🌹',giftId:5655,giftType:1,repeatEnd:false,groupId:'combo1',repeatCount:1});await new Promise(r=>setTimeout(r,150));ok((await state()).total===90,'Combo intermediário ignorado');
 const gift={userId:'g1',nickname:'Lu 🌹',giftId:5655,giftType:1,repeatEnd:true,groupId:'combo1',repeatCount:5};await emit('gift',gift);await emit('gift',gift);await poll(async()=>(await state()).total===93);ok((await state()).total===93,'Combo final aplicado uma vez');
 await emit('gift',{userId:'g2',nickname:'Bia',giftId:1,giftType:0,msgId:'hint1'});await poll(async()=>!!(await state()).q.hint);ok(true,'Presente por ID libera dica coletiva');
 await emit('follow',{userId:'f1',nickname:'Novo seguidor'});await emit('like',{userId:'l1',nickname:'Like',likeCount:100});await emit('share',{userId:'s1',nickname:'Compartilhou'});ok(true,'follow, like e share processados via WebSocket');
 await panel.click('#pause');s=await state();const remaining=s.remaining;await new Promise(r=>setTimeout(r,1200));ok(Math.abs((await state()).remaining-remaining)<.1,'Pausa mantém tempo congelado');await panel.click('#start');ok((await state()).state==='running','Retomada funciona');
 await fetch('http://localhost:21214/disconnect',{method:'POST',body:'{}'});await poll(async()=>(await state()).connection.includes('desconectado'));await poll(async()=>(await state()).connection.includes('socket aberto'),10000);ok(true,'Reconexão exponencial após queda WebSocket');
 await viewer.reload();await poll(async()=>(await viewer.locator('#responseCount').textContent())==='3 respostas');ok(true,'Visor recarregado recupera snapshot e placar');
 await panel.screenshot({path:path.join(out,'painel.png'),fullPage:true});await post('pause');
 for(const [w,h] of [[1080,1920],[540,960],[360,640]]){await viewer.setViewportSize({width:w,height:h});await viewer.waitForTimeout(150);await viewer.screenshot({path:path.join(out,`live-${w}x${h}.png`)});const layout=await viewer.evaluate(()=>{const stage=document.querySelector('.viewport').getBoundingClientRect(),q=document.querySelector('#question'),ans=document.querySelector('#answers');return {w:stage.width,h:stage.height,overflow:document.documentElement.scrollWidth>innerWidth,qBottom:q.getBoundingClientRect().bottom,answersTop:ans.getBoundingClientRect().top};});ok(Math.abs(layout.w-w)<1&&Math.abs(layout.h-h)<1&&!layout.overflow&&layout.qBottom<=layout.answersTop,`Layout ${w}×${h}: enquadramento e ausência de sobreposição`);}
 await viewer.setViewportSize({width:1080,height:1920});await post('reset');await post('settings',{duration:90,auto:false});const seen=new Set();
 for(let i=0;i<bank.length;i++){
   s=await post('next');seen.add(s.q.id);await poll(async()=>(await viewer.locator('#roundBadge').textContent())==='#'+String(s.round).padStart(3,'0'));
   const issue=await viewer.evaluate(()=>{const q=document.querySelector('#question'),a=document.querySelector('#answers');return q.scrollHeight>q.clientHeight+2||q.scrollWidth>q.clientWidth+2||q.getBoundingClientRect().bottom>a.getBoundingClientRect().top+1||[...document.querySelectorAll('.answer-text')].some(x=>x.scrollWidth>x.clientWidth+1);});assert(!issue,'Conteúdo transbordou: '+JSON.stringify(s.q));
 }
 ok(seen.size===bank.length,`${bank.length} questões sem repetição no ciclo e sem overflow`);
 await post('stop');await poll(async()=>(await viewer.locator('#phase').textContent())==='AGUARDANDO INÍCIO');ok(true,'Parar cancela fluxo automático');await post('reset');s=await state();ok(s.round===0&&s.rank.length===0&&s.count===0,'Reiniciar limpa rodada, votos e ranking');
 const resp=await fetch(base+'/api/command',{method:'POST',headers:{Origin:'https://exemplo.invalid','Content-Type':'application/json'},body:'{"action":"reset"}'});ok(resp.status===403,'Origem externa rejeitada');
 ok(errors.length===0,'Sem erros JavaScript: '+JSON.stringify(errors));await browser.close();fs.writeFileSync(path.join(out,'e2e-summary.json'),JSON.stringify({checks,bank:bank.length,errors,date:new Date().toISOString()},null,2));console.log(`${checks} verificações aprovadas`);
})().catch(e=>{console.error(e);process.exit(1)});
