// Preparação do backend em nuvem. Nenhuma chamada é feita ao importar este módulo.
// O futuro painel deve fornecer authorize() validando a sessão do proprietário.
const json=(code,body)=>new Response(JSON.stringify(body),{status:code,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const username=v=>String(v||'').replace(/^@/,'').trim();
const validUser=v=>/^[\p{L}\p{N}_.]{1,32}$/u.test(v);
const uuid=v=>/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(String(v||''));
async function body(request){const reader=request.body?.getReader();if(!reader)throw Error('body');const chunks=[];let size=0;while(true){const{done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>4096){await reader.cancel();throw Error('size');}chunks.push(value);}const raw=new Uint8Array(size);let offset=0;for(const chunk of chunks){raw.set(chunk,offset);offset+=chunk.byteLength;}return JSON.parse(new TextDecoder().decode(raw));}
export async function cloudBroker(request,env,{authorize=async()=>false,fetcher=globalThis.fetch}={}){
 if(!await authorize(request))return json(401,{error:'Entre no painel com sua conta.'});
 const url=new URL(request.url),paths=['/api/cloud/status','/api/cloud/avatar-token','/api/cloud/live-token'];if(!paths.includes(url.pathname))return json(404,{error:'Rota não encontrada.'});
 if(url.pathname==='/api/cloud/status'){
  if(request.method!=='GET')return json(405,{error:'Método não permitido.'});
  return json(200,{avatar:{provider:'LiveAvatar',configured:!!env.LIVEAVATAR_API_KEY&&uuid(env.LIVEAVATAR_AVATAR_ID),enabled:env.LUNA_AVATAR_ENABLED==='1'},events:{provider:'TikTools',configured:!!env.TIKTOOLS_API_KEY&&validUser(username(env.LUNA_TIKTOK_USERNAME)),enabled:env.LUNA_LIVE_ENABLED==='1'},localRuntimeRequired:false});
 }
 if(request.method!=='POST')return json(405,{error:'Método não permitido.'});
 if(request.headers.get('Origin')&&request.headers.get('Origin')!==url.origin)return json(403,{error:'Origem não permitida.'});
 if(!request.headers.get('Content-Type')?.startsWith('application/json'))return json(415,{error:'Envie JSON.'});
 let data;try{data=await body(request);if(!data||typeof data!=='object'||Array.isArray(data))throw Error();}catch{return json(400,{error:'Solicitação inválida.'});}
 if(data.consent!==true)return json(403,{error:'Confirme o uso do provedor em nuvem antes de continuar.'});
 try{
  if(url.pathname==='/api/cloud/avatar-token'){
   if(env.LUNA_AVATAR_ENABLED!=='1'||!env.LIVEAVATAR_API_KEY||!uuid(env.LIVEAVATAR_AVATAR_ID))return json(503,{error:'Avatar em nuvem não configurado e ativado.'});
   const response=await fetcher('https://api.liveavatar.com/v1/sessions/token',{method:'POST',headers:{'X-API-KEY':env.LIVEAVATAR_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({mode:'LITE',avatar_id:env.LIVEAVATAR_AVATAR_ID,is_sandbox:env.LUNA_AVATAR_SANDBOX!=='0',max_session_duration:60}),signal:AbortSignal.timeout(10000)});
   if(!response.ok)return json(502,{error:'O provedor não autorizou a sessão de avatar.'});
   const payload=await response.json(),token=payload.data?.session_token||payload.session_token;if(typeof token!=='string'||!token)return json(502,{error:'O provedor não retornou um token de sessão válido.'});
   return json(200,{sessionToken:token,provider:'LiveAvatar',mode:'LITE',maxSessionSeconds:60});
  }
  const creator=username(env.LUNA_TIKTOK_USERNAME);
  if(env.LUNA_LIVE_ENABLED!=='1'||!env.TIKTOOLS_API_KEY||!validUser(creator))return json(503,{error:'Fonte de eventos em nuvem não configurada e ativada.'});
  if(username(data.username)!==creator)return json(403,{error:'Canal não autorizado para esta sala.'});
  const endpoint=new URL('https://api.tik.tools/authentication/jwt');endpoint.searchParams.set('apiKey',env.TIKTOOLS_API_KEY);
  const response=await fetcher(endpoint.href,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({allowed_creators:[creator],expire_after:120,max_websockets:1}),signal:AbortSignal.timeout(10000)});
  if(!response.ok)return json(502,{error:'O provedor não autorizou os eventos da LIVE.'});
  const payload=await response.json(),token=payload.data?.token;if(typeof token!=='string'||!token)return json(502,{error:'O provedor não retornou um token de eventos válido.'});
  return json(200,{token,username:creator,websocketOrigin:'wss://api.tik.tools',expiresIn:120});
 }catch{return json(502,{error:'O serviço em nuvem não respondeu. Tente novamente pelo painel.'});}
}
