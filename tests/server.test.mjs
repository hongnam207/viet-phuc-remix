import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';

test('Render adapter binds PORT and preserves public HTTPS origin',async()=>{
 const child=spawn(process.execPath,['scripts/serve.mjs'],{env:{...process.env,PORT:'0',HOST:'0.0.0.0',RENDER_EXTERNAL_URL:'https://render-demo.test',GEMINI_API_KEY:''},stdio:['ignore','pipe','pipe']});
 try{
  const port=await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(new Error('Server startup timeout')),5000);child.once('error',reject);child.stdout.on('data',chunk=>{const match=String(chunk).match(/Listening on 0\.0\.0\.0:(\d+)/);if(match){clearTimeout(timeout);resolve(Number(match[1]));}});});
  const base='http://127.0.0.1:'+port;
  assert.equal((await fetch(base+'/')).status,200);
  const health=await fetch(base+'/healthz');assert.deepEqual(await health.json(),{status:'ok'});
  const response=await fetch(base+'/api/recommend',{method:'POST',headers:{Origin:'https://render-demo.test','Content-Type':'application/json'},body:'{}'});assert.equal(response.status,200);assert.equal((await response.json()).mode,'editorial');
  assert.equal((await fetch(base+'/api/recommend',{method:'POST',headers:{Origin:'https://another.test'},body:'{}'})).status,403);
  assert.equal((await fetch(base+'/api/recommend',{method:'POST',body:'x'.repeat(5000)})).status,413);
 }finally{child.kill();}
});
