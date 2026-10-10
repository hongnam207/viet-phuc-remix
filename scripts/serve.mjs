import http from 'node:http';
import {readFile} from 'node:fs/promises';
import worker from '../dist/server/index.js';
const port=Number(process.env.PORT||4173);
const host=process.env.HOST||'0.0.0.0';
const server=http.createServer(async(req,res)=>{try{
 const assetPath=new URL(req.url,'http://localhost').pathname;
 if(assetPath==='/models/human.glb'||assetPath==='/ai-models/pose.task'||/^\/wasm\/vision_wasm_(?:nosimd_|module_)?internal\.(?:js|wasm)$/.test(assetPath)){
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
  const data=await readFile(new URL('../dist/public'+assetPath,import.meta.url));
  res.writeHead(200,{'Content-Type':assetPath.endsWith('.glb')?'model/gltf-binary':assetPath.endsWith('.wasm')?'application/wasm':assetPath.endsWith('.js')?'text/javascript':'application/octet-stream','Content-Length':data.length,'Cache-Control':'public, max-age=86400','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:data);return;
 }
 if(req.url==='/healthz'){res.writeHead(200,{'Content-Type':'application/json'});res.end('{"status":"ok"}');return;}
 const chunks=[];let size=0;
 for await(const chunk of req){size+=chunk.length;if(size>4096){res.writeHead(413);res.end('Request too large');return;}chunks.push(chunk);}
 // Render terminates HTTPS at its proxy. Use its public origin for API origin checks.
 const origin=process.env.RENDER_EXTERNAL_URL||'http://'+(req.headers.host||'localhost:'+port);
 const request=new Request(new URL(req.url,origin),{method:req.method,headers:req.headers,...(!['GET','HEAD'].includes(req.method)?{body:Buffer.concat(chunks)}:{})});
 const response=await worker.fetch(request,process.env);res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
 }catch{res.writeHead(500);res.end('Server error');}
});
server.listen(port,host,()=>console.log('Listening on '+host+':'+server.address().port));
