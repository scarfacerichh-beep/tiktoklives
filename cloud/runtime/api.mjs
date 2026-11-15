import{seal,readConfig,safeConfig,mergeConfig,validId}from'./vault.mjs';
export const json=(status,data)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
async function readBody(request){let size=0;const chunks=[],reader=request.body?.getReader();if(!reader)throw Error('Solicitação vazia.');while(true){const{done,value}=await reader.read();if(done)break;size+=value.length;if(size>8192){await reader.cancel();throw Error('Solicitação muito grande.');}chunks.push(value);}const all=new Uint8Array(size);let offset=0;for(const c of chunks){all.set(c,offset);offset+=c.length;}const data=JSON.parse(new TextDecoder().decode(all));if(!data||typeof data!=='object'||Array.isArray(data))throw Error('Solicitação inválida.');return data;}
const host='https://api.liveavatar.com';
async function provider(url,key,{body,token,fetcher}={}){const r=await fetcher(url,{method:body===undefined?'GET':'POST',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{'X-API-KEY':key})},...(body===undefined?{}:{body:JSON.stringify(body)}),signal:AbortSignal.timeout(12000)});if(!r.ok)throw Error('O provedor recusou a solicitação. Confira a chave, o plano e os limites da conta.');const p=await r.json();return p.data??p;}
export async function api(request,env,{fetcher=fetch,referenceImage=null}={}){
 const path=new URL(request.url).pathname;
 // O Site permanece owner-private; o dispatch protege GETs e fornece a identidade nos writes.
 if(!env.BUCKET||!env.LUNA_VAULT_KEY)return json(503,{error:'Armazenamento protegido ainda não está disponível.',storageReady:false});
 if(request.method!=='GET'){
  if(request.method!=='POST')return json(405,{error:'Método não permitido.'});
  if(!request.headers.get('oai-authenticated-user-id'))return json(401,{error:'Entre no painel com sua conta ChatGPT para configurar.'});
  if(request.headers.get('Origin')!==new URL(request.url).origin)return json(403,{error:'Origem não permitida.'});
  if(!request.headers.get('Content-Type')?.startsWith('application/json'))return json(415,{error:'Envie JSON.'});
 }
 try{
  const c=await readConfig(env);
  if(path==='/api/config'&&request.method==='GET')return json(200,{...safeConfig(c),storageReady:true});
  if(request.method!=='POST')return json(404,{error:'Rota não encontrada.'});
  const data=await readBody(request);
  if(path==='/api/config/save'){const updated=mergeConfig(c,data);await env.BUCKET.put('private/luna-config-v1',await seal(updated,env.LUNA_VAULT_KEY));return json(200,{ok:true,...safeConfig(updated),storageReady:true});}
  if(path==='/api/config/import-avatar'){
   if(data.consent!==true)return json(403,{error:'Confirme a criação do avatar e os créditos aplicáveis.'});
   if(!c.liveAvatarKey)return json(409,{error:'Salve a chave LiveAvatar primeiro.'});
   if(c.avatarId)return json(409,{error:'Esta sala já tem um avatar vinculado. Confira o catálogo antes de criar outro.'});
   if(!referenceImage)return json(503,{error:'Imagem de referência não disponível.'});
   const existing=await env.BUCKET.get('private/avatar-import-v1');if(existing)return json(409,{error:'Uma criação já foi solicitada. Confira o catálogo do LiveAvatar antes de repetir.'});
   const marker=await env.BUCKET.put('private/avatar-import-v1',JSON.stringify({at:Date.now(),state:'requested'}),{onlyIf:{etagDoesNotMatch:'*'}});if(!marker)return json(409,{error:'Outra criação já está em andamento.'});
   const form=new FormData();form.append('file',new Blob([referenceImage()],{type:'image/jpeg'}),'luna-reference.jpg');form.append('resolution','720');
   const response=await fetcher(host+'/v1-alpha/avatars/image',{method:'POST',headers:{'X-API-KEY':c.liveAvatarKey},body:form,signal:AbortSignal.timeout(60000)});
   if(!response.ok){if([400,401,402,403,404,413,422,429].includes(response.status))await env.BUCKET.delete('private/avatar-import-v1');return json(502,{error:'O LiveAvatar não confirmou a criação. Confira a chave, o plano e o catálogo na sua conta antes de repetir.'});}
   const p=await response.json(),avatar=p.data??p;if(!validId(avatar.id))throw Error('Invalid avatar result');
   const updated={...c,avatarId:avatar.id};await env.BUCKET.put('private/luna-config-v1',await seal(updated,env.LUNA_VAULT_KEY));return json(200,{...safeConfig(updated),storageReady:true,avatarStatus:String(avatar.status||'INIT')});
  }
  if(path==='/api/config/catalog'){
   if(!c.liveAvatarKey)return json(409,{error:'Salve a chave LiveAvatar primeiro.'});
   const [avatars,voices]=await Promise.all([provider(host+'/v1/avatars',c.liveAvatarKey,{fetcher}),provider(host+'/v1/voices',c.liveAvatarKey,{fetcher})]);
   const map=items=>(items.results||[]).slice(0,50).filter(x=>validId(x.id)).map(x=>({id:x.id,name:String(x.name||'Sem nome').slice(0,80),language:String(x.language||'').slice(0,30),status:String(x.status||'').slice(0,20)}));
   return json(200,{avatars:map(avatars),voices:map(voices)});
  }
  if(path==='/api/cloud/live-token'){
   if(data.consent!==true)return json(403,{error:'Confirme o envio dos eventos e apelidos ao avatar antes de iniciar.'});
   if(!c.tikToolsKey)return json(409,{error:'Falta cadastrar a chave TikTools.'});
   const url=new URL('https://api.tik.tools/authentication/jwt');url.searchParams.set('apiKey',c.tikToolsKey);
   const r=await fetcher(url.href,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({allowed_creators:[c.channel],expire_after:120,max_websockets:1}),signal:AbortSignal.timeout(12000)});if(!r.ok)return json(502,{error:'TikTools não autorizou a conexão. Confira a chave e o plano.'});const p=await r.json();if(typeof p.data?.token!=='string')return json(502,{error:'TikTools não retornou um token válido.'});return json(200,{token:p.data.token,channel:c.channel,origin:'wss://api.tik.tools'});
  }
  if(path==='/api/cloud/start'){
   if(data.consent!==true)return json(403,{error:'Confirme o teste e o uso dos serviços antes de iniciar.'});
   if(!safeConfig(c).avatarConfigured)return json(409,{error:'Configure a chave, o avatar e a voz do LiveAvatar primeiro.'});
   const token=await provider(host+'/v1/sessions/token',c.liveAvatarKey,{body:{mode:'FULL',avatar_id:c.avatarId,is_sandbox:c.sandbox,max_session_duration:60,video_settings:{quality:'high',encoding:'H264'},avatar_persona:{voice_id:c.voiceId,language:'pt'}},fetcher});
   if(!validId(token.session_id)||typeof token.session_token!=='string')throw Error('O provedor retornou uma sessão inválida.');
   try{const started=await provider(host+'/v1/sessions/start',null,{body:{},token:token.session_token,fetcher});if(typeof started.livekit_url!=='string'||!started.livekit_url.startsWith('wss://')||typeof started.livekit_client_token!=='string')throw Error('O provedor retornou um stream inválido.');return json(200,{sessionId:token.session_id,sessionToken:token.session_token,url:started.livekit_url,clientToken:started.livekit_client_token,maxSeconds:60,sandbox:c.sandbox});}
   catch(e){try{await provider(host+'/v1/sessions/stop',null,{body:{session_id:token.session_id},token:token.session_token,fetcher});}catch{}throw e;}
  }
  if(path==='/api/cloud/stop'){
   if(!validId(data.sessionId)||typeof data.sessionToken!=='string'||data.sessionToken.length>4096)return json(400,{error:'Sessão inválida.'});
   await provider(host+'/v1/sessions/stop',null,{body:{session_id:data.sessionId},token:data.sessionToken,fetcher});return json(200,{ok:true});
  }
  return json(404,{error:'Rota não encontrada.'});
 }catch(e){if(e instanceof SyntaxError)return json(400,{error:'Solicitação inválida.'});const allowed=['Use o ID do LiveAvatar, não o ID de vídeo do HeyGen.','Credencial inválida.','Modo inválido.','Solicitação muito grande.'];return json(allowed.includes(e.message)?400:502,{error:allowed.includes(e.message)?e.message:'Não foi possível concluir a configuração ou contatar o provedor. Confira seus dados e tente pelo painel.'});}
}
