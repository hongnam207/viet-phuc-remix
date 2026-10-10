export default {
 async fetch(request,env={}){
  const path=new URL(request.url).pathname;
  if(path==='/api/recommend')return recommend(request,env);
  if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405});
  if(path==='/demo.mp4'&&VIDEO){
   const bytes=Uint8Array.from(atob(VIDEO),c=>c.charCodeAt(0));
   const headers={'Content-Type':'video/mp4','Accept-Ranges':'bytes','Cache-Control':'public, max-age=3600'};
   const range=request.headers.get('range');
   if(range){const m=/^bytes=(\d+)-(\d*)$/.exec(range);if(!m)return new Response(null,{status:416,headers:{'Content-Range':'bytes */'+bytes.length}});const start=Number(m[1]),end=m[2]?Math.min(Number(m[2]),bytes.length-1):bytes.length-1;if(start>end||start>=bytes.length)return new Response(null,{status:416,headers:{'Content-Range':'bytes */'+bytes.length}});return new Response(request.method==='HEAD'?null:bytes.slice(start,end+1),{status:206,headers:{...headers,'Content-Range':'bytes '+start+'-'+end+'/'+bytes.length,'Content-Length':String(end-start+1)}});}
   return new Response(request.method==='HEAD'?null:bytes,{headers:{...headers,'Content-Length':String(bytes.length)}});
  }
  const body=ASSETS[path];if(body===undefined)return new Response('Not found',{status:404});
  return new Response(request.method==='HEAD'?null:body,{headers:{'Content-Type':path.endsWith('.svg')?'image/svg+xml':path.endsWith('.css')?'text/css; charset=utf-8':path.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','Content-Security-Policy':"default-src 'self'; img-src 'self' data: blob:; style-src 'self'; script-src 'self' 'wasm-unsafe-eval'; worker-src 'self'; connect-src 'self' blob:; media-src 'self'; object-src 'none'; base-uri 'self'"}});
 }
};
