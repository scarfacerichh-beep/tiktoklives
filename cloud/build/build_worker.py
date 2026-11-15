from pathlib import Path
import base64,json,shutil,gzip
root=Path('/workspace/work/github-delivery');site=Path('/workspace/sites/luna-cartas');out=site/'dist'
# Mantém a versão 0.3 e os arquivos originais fora do build.
backup=Path('/workspace/work/luna-site-v03-backup')
if not backup.exists():shutil.copytree(out,backup)
assets={}
for f in (root/'static/luna-online').iterdir():
 if not f.is_file() or f.name in ('package.json','luna-poster.png'):continue
 mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.txt':'text/plain; charset=utf-8'}.get(f.suffix,'application/octet-stream')
 data=f.read_bytes()
 if f.name=='index.html':data=data.replace(b'luna-poster.png',b'luna-poster.jpg')
 if f.name=='studio.css':data=data.replace(b"url('../fonts/InterVariable.woff2')",b"url('fonts/InterVariable.woff2')")
 assets['/'+f.name]={'type':mime,'data':base64.b64encode(data).decode()}
for name,p,mime in [('luna-reference.jpg','/workspace/work/luna-heygen-production/luna-reference-1080.jpg','image/jpeg'),('luna-opening.mp4','/workspace/work/luna-heygen-production/luna-opening-web.mp4','video/mp4'),('luna-poster.jpg','/workspace/work/luna-heygen-production/luna-poster-web.jpg','image/jpeg'),('fonts/InterVariable.woff2',str(root/'static/fonts/InterVariable.woff2'),'font/woff2')]:assets['/'+name]={'type':mime,'data':base64.b64encode(Path(p).read_bytes()).decode()}
vault=(root/'cloud/runtime/vault.mjs').read_text().replace('export ','')
api=(root/'cloud/runtime/api.mjs').read_text();api=api[api.index('\n')+1:].replace('export ','')
worker='const ASSETS='+json.dumps(assets,separators=(',',':'))+';\nconst CACHE=new Map();\n'+vault+'\n'+api+'''
function assetResponse(request){const url=new URL(request.url),path=url.pathname==='/'?'/index.html':url.pathname,asset=ASSETS[path];if(!asset)return new Response('Não encontrado',{status:404});if(!['GET','HEAD'].includes(request.method))return new Response(null,{status:405});let data=CACHE.get(path);if(!data){data=Uint8Array.from(atob(asset.data),c=>c.charCodeAt(0));CACHE.set(path,data);}const headers={'Content-Type':asset.type,'X-Content-Type-Options':'nosniff','Cache-Control':'private, max-age=60','Accept-Ranges':'bytes'};let status=200,start=0,end=data.length-1;const range=request.headers.get('Range');if(range){const m=/^bytes=(\\d*)-(\\d*)$/.exec(range);if(!m||(!m[1]&&!m[2]))return new Response(null,{status:416,headers:{'Content-Range':'bytes */'+data.length}});if(!m[1])start=Math.max(0,data.length-Number(m[2]));else start=Number(m[1]);if(m[1]&&m[2])end=Math.min(end,Number(m[2]));if(start>end||start>=data.length)return new Response(null,{status:416,headers:{'Content-Range':'bytes */'+data.length}});status=206;headers['Content-Range']=`bytes ${start}-${end}/${data.length}`;}headers['Content-Length']=String(end-start+1);return new Response(request.method==='HEAD'?null:data.slice(start,end+1),{status,headers});}
export default{async fetch(request,env,ctx){if(new URL(request.url).pathname.startsWith('/api/'))return api(request,env,{referenceImage:()=>Uint8Array.from(atob(ASSETS['/luna-reference.jpg'].data),c=>c.charCodeAt(0))});return assetResponse(request);}};
'''
shutil.rmtree(out);(out/'server').mkdir(parents=True);(out/'server/index.js').write_text(worker)
manifest=json.loads((site/'.openai/hosting.json').read_text());manifest.pop('static',None);manifest['r2']='BUCKET';(site/'.openai/hosting.json').write_text(json.dumps(manifest,indent=2))
shutil.copytree(root/'cloud/runtime',site/'cloud/runtime',dirs_exist_ok=True)
print(json.dumps({'workerBytes':len(worker.encode()),'gzipBytes':len(gzip.compress(worker.encode())),'assets':len(assets),'manifest':manifest}))
