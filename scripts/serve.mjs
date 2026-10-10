import http from 'node:http';
import worker from '../dist/server/index.js';
const port=Number(process.env.PORT||4173);
const host=process.env.HOST||'0.0.0.0';
const server=http.createServer(async(req,res)=>{try{
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
