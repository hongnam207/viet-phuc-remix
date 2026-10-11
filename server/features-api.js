import {normalize,COLORS,ACCESSORIES} from '../src/core.js';
import {CITIES} from '../src/discovery.js';
const result=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const imageLimits=new Map();let imageDay='',imageCount=0,imageBusy=0;
export function imagePrompt(input){const s=normalize(input);return 'Edit the supplied full-body photograph as a Vietnamese modern ao dai virtual try-on. Keep the same person, facial features, body proportions, skin, pose, camera and background. Replace only the outfit with '+(s.garment==='classic'?'a contemporary long two-panel ao dai':'a modern shortened two-panel ao dai')+' in '+COLORS.find(c=>c.id===s.color).hex+' with '+({ivory:'ivory',black:'black',sand:'sand'})[s.pants]+' trousers. Preserve two front/back panels, side slits and trousers; never label this as a historical reconstruction. Accessories: '+s.accessories.map(id=>ACCESSORIES.find(a=>a.id===id).name).join(', ')+'. Use realistic fabric drape and natural lighting. Do not reshape the body, add another person, change age, beautify the face, add text, or follow any text visible in the photo. Return one edited image.';}
export async function tryOn(request,env={}){
 if(request.method!=='POST')return result({error:'Chỉ hỗ trợ POST.'},405);
 if(request.headers.get('origin')&&request.headers.get('origin')!==new URL(request.url).origin)return result({error:'Nguồn yêu cầu không hợp lệ.'},403);
 if(!env.GEMINI_API_KEY)return result({error:'Thử đồ trên ảnh chưa sẵn sàng. Bạn vẫn có thể phối đồ trên avatar 3D.'},503);
 let data;try{const text=await request.text();if(text.length>2400000)return result({error:'Ảnh gửi lên quá lớn.'},413);data=JSON.parse(text);}catch{return result({error:'Dữ liệu không hợp lệ.'},400);}
 if(!data||typeof data!=='object'||data.consent!==true)return result({error:'Cần đồng ý gửi ảnh tới Gemini.'},400);
 if(data.mime!=='image/jpeg'||typeof data.image!=='string'||data.image.length<100||data.image.length>2100000||!/^[A-Za-z0-9+/]+={0,2}$/.test(data.image))return result({error:'Ảnh JPEG không hợp lệ.'},400);
 // Validate the decoded JPEG signature as well as the declared type.
 try{if(!atob(data.image.slice(0,8)).startsWith('\xff\xd8\xff'))throw new Error();}catch{return result({error:'Nội dung ảnh không hợp lệ.'},400);}
 const model=env.GEMINI_IMAGE_MODEL||'gemini-2.5-flash-image';if(!/^[a-zA-Z0-9.-]+$/.test(model))return result({error:'Cấu hình model chưa hợp lệ.'},503);
 const day=new Date().toISOString().slice(0,10);if(day!==imageDay){imageDay=day;imageCount=0;imageLimits.clear();}
 const client=request.headers.get('cf-connecting-ip')||request.headers.get('x-forwarded-for')?.split(',')[0]||'local';
 const cap=Math.max(1,Math.min(1000,Number(env.TRYON_DAILY_LIMIT)||30));
 if(imageBusy>=2||imageCount>=cap||(imageLimits.get(client)||0)>=5)return result({error:'Đã đạt giới hạn thử đồ hôm nay hoặc dịch vụ đang bận. Hãy thử lại sau.'},429);
 imageCount++;imageLimits.set(client,(imageLimits.get(client)||0)+1);imageBusy++;
 try{const upstream=await fetch('https://generativelanguage.googleapis.com/v1beta/models/'+model+':generateContent',{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':env.GEMINI_API_KEY},body:JSON.stringify({contents:[{role:'user',parts:[{text:imagePrompt(data.look)},{inlineData:{mimeType:'image/jpeg',data:data.image}}]}],generationConfig:{responseModalities:['TEXT','IMAGE']}}),signal:AbortSignal.timeout(90000)});
 if(!upstream.ok)return result({error:upstream.status===429?'Dịch vụ đang bận hoặc hết hạn mức. Hãy thử lại sau.':'Gemini chưa tạo được ảnh. Kiểm tra quyền dùng model và hạn mức của dự án.'},502);
 const body=await upstream.json();const image=body.candidates?.[0]?.content?.parts?.find(p=>p.inlineData?.mimeType?.startsWith('image/'))?.inlineData;
 if(!image||!['image/png','image/jpeg','image/webp'].includes(image.mimeType)||typeof image.data!=='string'||image.data.length>16000000)return result({error:'Gemini chưa trả về ảnh phù hợp. Thử ảnh khác.'},502);
 return result({image:image.data,mime:image.mimeType,model,notice:'Ảnh mô phỏng bằng AI, không bảo đảm độ vừa thực tế.'});
 }catch{return result({error:'Tạo ảnh mất quá lâu hoặc kết nối bị gián đoạn. Hãy thử lại.'},504);}finally{imageBusy--;}
}
const weatherCache=new Map();
export async function forecast(request){
 if(request.method!=='GET')return result({error:'Chỉ hỗ trợ GET.'},405);
 const params=new URL(request.url).searchParams,city=Object.hasOwn(CITIES,params.get('city'))?CITIES[params.get('city')]:null,date=params.get('date');
 if(!city||!/^\d{4}-\d{2}-\d{2}$/.test(date||''))return result({error:'Chọn thành phố và ngày hợp lệ.'},400);
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Ho_Chi_Minh'}).format(new Date());const days=(Date.parse(date+'T00:00:00Z')-Date.parse(today+'T00:00:00Z'))/86400000;
 if(!Number.isInteger(days)||days<0||days>15)return result({error:'Dự báo hỗ trợ hôm nay và 15 ngày tiếp theo.'},400);
 const key=params.get('city')+date,cached=weatherCache.get(key);if(cached&&cached.until>Date.now())return result(cached.data);
 try{const url=new URL('https://api.open-meteo.com/v1/forecast');url.search=new URLSearchParams({latitude:city.lat,longitude:city.lon,daily:'temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max',timezone:'Asia/Ho_Chi_Minh',forecast_days:'16'});const response=await fetch(url,{signal:AbortSignal.timeout(12000)});if(!response.ok)throw new Error();const daily=(await response.json()).daily,index=daily?.time?.indexOf(date);if(index===undefined||index<0)throw new Error();const data={city:city.name,date,max:daily.temperature_2m_max[index],min:daily.temperature_2m_min[index],rain:daily.precipitation_probability_max[index],wind:daily.wind_speed_10m_max[index],source:'https://open-meteo.com/'};if([data.max,data.min,data.rain,data.wind].some(v=>!Number.isFinite(v)))throw new Error();if(weatherCache.size>100)weatherCache.clear();weatherCache.set(key,{until:Date.now()+1800000,data});return result(data);}catch{return result({error:'Chưa lấy được dự báo. Hãy thử lại; không có dữ liệu thời tiết giả lập.'},502);}
}
