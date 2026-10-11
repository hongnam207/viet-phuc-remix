import {geminiStatus} from './gemini-status.js';
import {normalize,evaluate,buildPrompt,AI_SCHEMA,validateAI} from '../src/core.js';
export async function recommend(request,env){
 const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}});
 if(request.method!=='POST')return json({error:'Chỉ hỗ trợ POST.'},405);
 const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return json({error:'Nguồn yêu cầu không hợp lệ.'},403);
 let input;try{const text=await request.text();if(text.length>4096)return json({error:'Dữ liệu quá dài.'},413);input=normalize(JSON.parse(text));}catch{return json({error:'Dữ liệu không hợp lệ.'},400);}
 const fallback={...evaluate(input),mode:'editorial'};
 if(!env.GEMINI_API_KEY)return json({...fallback,status:'Chưa kết nối Gemini · gợi ý từ bộ quy tắc'});
 try{const model=env.GEMINI_MODEL||'gemini-3.5-flash-lite';if(!/^[a-zA-Z0-9.-]+$/.test(model))throw new Error('model');
 const response=await fetch('https://generativelanguage.googleapis.com/v1beta/models/'+model+':generateContent',{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':env.GEMINI_API_KEY},body:JSON.stringify({contents:[{role:'user',parts:[{text:buildPrompt(input)}]}],generationConfig:{temperature:0.4,responseMimeType:'application/json',responseSchema:AI_SCHEMA}}),signal:AbortSignal.timeout(20000)});
 if(!response.ok)return json({...fallback,status:geminiStatus(response.status)+' · gợi ý từ bộ quy tắc'});const result=await response.json();const output=JSON.parse(result.candidates?.[0]?.content?.parts?.map(p=>p.text||'').join('')||'null');if(!validateAI(output))throw new Error('schema');return json({...fallback,...output,mode:'gemini',status:'Gợi ý từ Gemini · thông tin văn hóa do đội biên tập'});
 }catch{return json({...fallback,status:'Gemini chưa phản hồi hợp lệ · đã dùng gợi ý từ bộ quy tắc'});}
}
