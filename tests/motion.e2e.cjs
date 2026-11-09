// Testa eventos visuais reais e captura uma prévia da aplicação em movimento.
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const base=process.env.ARENA_URL||'http://127.0.0.1:8790',out=process.env.EVIDENCE_DIR||path.join(__dirname,'../evidence');fs.mkdirSync(out,{recursive:true});
const bank=JSON.parse(cp.execFileSync(process.env.PYTHON||'python3',['-c','import json;from questions import BANK;print(json.dumps(BANK))'],{cwd:path.join(__dirname,'..')}));
async function cmd(action,data={}){const r=await fetch(base+'/api/command',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,data})});assert.equal(r.status,200);return r.json();}
async function state(){return(await fetch(base+'/api/state')).json();}
async function poll(fn,ms=9000){const start=Date.now();while(Date.now()-start<ms){if(await fn())return;await new Promise(r=>setTimeout(r,60));}throw Error('Tempo esgotado: '+fn);}
let checks=0;function ok(x,label){assert(x,label);checks++;console.log('OK '+label);}
async function nonMemory(){let s;do{s=await cmd('next');}while(s.phase==='memorize');return s;}
async function vote(uid,name,choice){await cmd('event',{simulated:true,event:'chat',data:{userId:uid,nickname:name,comment:choice,msgId:crypto.randomUUID()}});}
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM||'/usr/bin/chromium',args:['--no-sandbox']});const errors=[];
 const context=await browser.newContext({viewport:{width:1080,height:1920},recordVideo:{dir:path.join(out,'video'),size:{width:540,height:960}}});
 await context.addInitScript(()=>{window.__motionCalls=[];const original=Element.prototype.animate;Element.prototype.animate=function(frames,options){window.__motionCalls.push({id:this.id,classes:this.className,frames});if(window.__motionCalls.length>200)window.__motionCalls.shift();return original.call(this,frames,options);};});
 const p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));await cmd('reset');await cmd('settings',{duration:15,interval:10,auto:false,visualMotion:'vivid',voiceEnabled:false});await p.goto(base+'/?live=1');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);
 let s=await nonMemory();await poll(async()=>(await p.locator('#roundBadge').textContent())==='#'+String(s.round).padStart(3,'0'));await p.waitForTimeout(600);
 ok((await p.locator('.canvas').getAttribute('data-motion'))==='vivid','Modo vibrante aplicado ao visor');
 ok(await p.locator('.ambient-ribbon').first().evaluate(e=>getComputedStyle(e).animationName==='auroraDrift'),'Fundo tem movimento ambiente');
 const firstCorrect='ABCD'[bank.find(q=>q.id===s.q.id).key];await vote('mariana','Mariana',firstCorrect);
 await poll(async()=>(await p.locator('#responseCount').textContent())==='1 resposta');
 ok(await p.evaluate(()=>window.__motionCalls.some(a=>a.id==='responseCount')),'Voto real dispara reação no contador');
 await p.waitForTimeout(500);const stable=await p.evaluate(()=>window.__motionCalls.filter(a=>a.id==='responseCount').length);await cmd('status',{status:'teste de sincronização',mode:'TESTE'});await p.waitForTimeout(150);
 ok(stable===await p.evaluate(()=>window.__motionCalls.filter(a=>a.id==='responseCount').length),'Snapshot repetido não reinicia o efeito de voto');
 await vote('pedro','Pedro',firstCorrect);await p.waitForTimeout(450);
 // Pedido real de nova rodada: animação de entrada e mudança de líder.
 const entries=await p.evaluate(()=>window.__motionCalls.filter(a=>a.id==='card').length);s=await nonMemory();await poll(async()=>(await p.locator('#roundBadge').textContent())==='#'+String(s.round).padStart(3,'0'));
 ok((await p.evaluate(()=>window.__motionCalls.filter(a=>a.id==='card').length))>entries,'Nova rodada tem entrada animada');
 const correct='ABCD'[bank.find(q=>q.id===s.q.id).key];await p.waitForTimeout(650);await vote('pedro','Pedro',correct);await poll(async()=>(await p.locator('.rank strong').first().textContent())==='Pedro');
 ok(await p.evaluate(()=>window.__motionCalls.some(a=>a.classes.includes('rank')&&a.frames[0]?.transform?.startsWith('translateX('))),'Mudança real de líder anima a posição no ranking');
 await p.waitForTimeout(700);for(const [width,height]of[[1080,1920],[540,960],[360,640]]){await p.setViewportSize({width,height});await p.waitForTimeout(120);const layout=await p.evaluate(()=>{const q=document.querySelector('#question'),a=document.querySelector('#answers'),hint=document.querySelector('#hint'),head=document.querySelector('.gift-head');return document.documentElement.scrollWidth<=innerWidth&&q.scrollHeight<=q.clientHeight+2&&q.getBoundingClientRect().bottom<=a.getBoundingClientRect().top+1&&hint.getBoundingClientRect().bottom<=head.getBoundingClientRect().top+1;});ok(layout,`Layout sem corte ou colisão em ${width}×${height}`);await p.screenshot({path:path.join(out,`neon-${width}x${height}.png`)});}
 await p.setViewportSize({width:1080,height:1920});
 // Desligar movimento cancela tanto CSS quanto Web Animations; a cor permanece.
 await cmd('settings',{visualMotion:'off'});await poll(async()=>(await p.locator('.canvas').getAttribute('data-motion'))==='off');
 ok(await p.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length===0),'Desligar animações interrompe movimento ativo');
 await cmd('settings',{visualMotion:'soft'});await poll(async()=>(await p.locator('.canvas').getAttribute('data-motion'))==='soft');ok(true,'Modo suave sincroniza sem recarregar');
 await p.emulateMedia({reducedMotion:'reduce'});await poll(async()=>(await p.locator('.canvas').getAttribute('data-motion'))==='off');ok(await p.evaluate(()=>document.getAnimations().filter(a=>a.playState==='running').length===0),'Preferência do sistema prevalece sobre o modo escolhido');await p.emulateMedia({reducedMotion:'no-preference'});await cmd('settings',{visualMotion:'vivid'});
 await poll(async()=>(await state()).state==='reveal',18000);await poll(async()=>(await p.locator('.answer.correct').count())===1);await p.waitForTimeout(650);ok((await p.locator('.canvas').getAttribute('data-state'))==='reveal','Revelação colore a alternativa correta');await p.screenshot({path:path.join(out,'neon-revelacao-1080x1920.png')});
 await cmd('pause');await poll(async()=>(await p.locator('.canvas').getAttribute('data-state'))==='paused');ok(await p.locator('.ambient-ribbon').first().evaluate(e=>getComputedStyle(e).animationPlayState==='paused'),'Pausar congela o movimento ambiente');
 // Conquista: cinco acertos gerados por respostas, sem prêmio injetado.
 await cmd('reset');await cmd('settings',{duration:5,interval:10,visualMotion:'vivid'});
 for(let i=0;i<5;i++){s=await nonMemory();await vote('winner','Luna', 'ABCD'[bank.find(q=>q.id===s.q.id).key]);}
 await poll(async()=>(await state()).state==='reveal');await poll(async()=>p.locator('#lootIcon').isVisible());
 ok((await p.locator('#toast').textContent()).includes('baú visual'),'Baú ilustrado aparece só após conquista real');
 ok(await p.locator('#fxLayer').evaluate(e=>e.children.length<=30),'Quantidade de partículas permanece limitada');await p.waitForTimeout(700);await p.screenshot({path:path.join(out,'neon-bau-1080x1920.png')});
 const frameStats=await p.evaluate(()=>new Promise(resolve=>{const intervals=[];let last=performance.now();function frame(t){intervals.push(t-last);last=t;if(intervals.length<90)requestAnimationFrame(frame);else resolve({frames:intervals.length,meanMs:intervals.reduce((a,b)=>a+b,0)/intervals.length});}requestAnimationFrame(frame);}));
 ok(errors.length===0,'Sem erros JavaScript');await cmd('stop');const video=p.video();await context.close();await video.saveAs(path.join(out,'arena-4.2.webm'));await browser.close();fs.writeFileSync(path.join(out,'motion-summary.json'),JSON.stringify({checks,errors,frameStats,syntheticEvents:true},null,2));console.log(JSON.stringify({checks,frameStats}));
})().catch(e=>{console.error(e);process.exit(1)});
