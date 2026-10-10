import {readFile,mkdir,writeFile,cp} from 'node:fs/promises';
import {build} from 'esbuild';
const read=p=>readFile(p,'utf8');
const assets={};for(const name of ['index.html','style.css','app.js','core.js'])assets['/'+(name==='index.html'?'':name)]=await read('src/'+name);
assets['/style.css']+='\n'+await read('src/fitting.css');
const app=await build({entryPoints:['src/app.js'],bundle:true,format:'esm',minify:true,write:false,target:'es2022',legalComments:'inline'});
assets['/app.js']=app.outputFiles[0].text;
const photo=await build({entryPoints:['src/photo-worker.js'],bundle:true,format:'iife',minify:true,write:false,target:'es2022',legalComments:'inline'});
assets['/photo-worker.js']=photo.outputFiles[0].text;
assets['/licenses.txt']='Three.js\n'+await read('assets/THREE-LICENSE.txt')+'\nMediaPipe Tasks Vision\n'+await read('assets/APACHE-2.0-LICENSE.txt');
await mkdir('dist/public/ai-models',{recursive:true});await cp('assets/pose_landmarker_lite.task','dist/public/ai-models/pose.task');
await cp('node_modules/@mediapipe/tasks-vision/wasm','dist/public/wasm',{recursive:true});
const core=(await read('src/core.js')).replace(/export /g,'');const api=(await read('server/api.js')).replace(/^import[^\n]+\n/,'').replace(/export /g,'');
assets['/video']='<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Video giới thiệu — Việt phục Remix</title><link rel="stylesheet" href="/style.css"></head><body><main><section class="collection"><p class="eyebrow">DEMO AUDITION 2026</p><h1>Việt phục Remix</h1><p class="intro">Video 60 giây, dựng từ ảnh chụp demo thực, có chú thích và không có lời thoại.</p><video class="demo-video" controls preload="metadata" src="/demo.mp4"></video><p><a href="/">← Trở về phòng phối đồ</a> · <a href="/demo.mp4">Mở file video ↗</a></p></section></main></body></html>';
let video='';try{video=(await readFile('docs/viet-phuc-remix-demo.mp4')).toString('base64');}catch{}
const worker=core+'\n'+api+'\nconst ASSETS='+JSON.stringify(assets)+';\nconst VIDEO='+JSON.stringify(video)+';\n'+await read('server/worker-template.js');
await mkdir('dist/server',{recursive:true});await mkdir('dist/.openai',{recursive:true});await writeFile('dist/server/index.js',worker);await writeFile('worker/index.js',worker);let hosting='{}';try{hosting=await read('.openai/hosting.json');}catch{}await writeFile('dist/.openai/hosting.json',hosting);console.log('Worker built: 4 assets + Gemini API');
