import {normalize, COLORS} from './core.js';
export const BASE_PROFILE={shoulder:1,hip:1,leg:1,skin:'#d7a482'};
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export function safeProfile(p={}){const val=(k,a,b)=>Number.isFinite(Number(p[k]))?clamp(Number(p[k]),a,b):1;return {shoulder:val('shoulder',.8,1.2),hip:val('hip',.8,1.2),leg:val('leg',.85,1.15),skin:/^#[\da-f]{6}$/i.test(p.skin||'')?p.skin:BASE_PROFILE.skin};}
export function profileFromPose(poses,width,height){
 if(!Array.isArray(poses)||poses.length!==1)throw new Error(poses?.length>1?'Ảnh có nhiều người. Hãy chọn ảnh chỉ có một người.':'Chưa nhận diện được người. Chọn ảnh rõ, đủ từ đầu đến bàn chân.');
 const p=poses[0],need=[0,11,12,23,24,25,26,27,28,31,32];
 if(p.length<33||need.some(i=>!p[i]||!Number.isFinite(p[i].x)||!Number.isFinite(p[i].y)||(p[i].visibility??0)<.65||p[i].x<.015||p[i].x>.985||p[i].y<.015||p[i].y>.985))throw new Error('Chưa thấy rõ toàn thân. Hãy chụp chính diện, đủ đầu và bàn chân, tay cách thân một chút.');
 const dist=(i,j)=>Math.hypot((p[i].x-p[j].x)*width,(p[i].y-p[j].y)*height),mid=i=>(p[i].y+p[i+1].y)*height/2;
 const torso=mid(23)-mid(11),legs=mid(27)-mid(23),shoulder=dist(11,12),hip=dist(23,24);
 if(torso<=0||legs<=0||shoulder/torso<.55||shoulder/torso>1.8||Math.abs(p[11].y-p[12].y)*height/shoulder>.25||Math.abs(p[11].z-p[12].z)>.16||mid(25)<=mid(23)||mid(27)<=mid(25)||legs/torso<.9)throw new Error('Tư thế hoặc góc chụp chưa phù hợp. Hãy đứng thẳng và nhìn chính diện, tránh ảnh ngồi hoặc chụp nghiêng.');
 return {profile:safeProfile({shoulder:shoulder/torso/.74,hip:hip/torso/.43,leg:legs/torso/1.26}),confidence:Math.round(Math.min(...need.map(i=>p[i].visibility))*100)};
}
// A transparent design preference score, not a prediction of attractiveness or garment fit.
export function rankLooks(input,profile){const s=normalize(input),p=safeProfile(profile);const looks=[];
 for(const garment of ['classic','remix'])for(const color of COLORS){const look=normalize({...s,garment,color:color.id});let score=60;const why=[];
 if(garment==='classic'&&['school','wedding'].includes(s.event)){score+=12;why.push('Dáng tà dài cho tổng thể liền mạch trong dịp trang trọng.');}
 if(garment==='remix'&&['tet','festival'].includes(s.event)){score+=12;why.push('Tà ngắn tạo cảm giác nhẹ và thuận tiện di chuyển.');}
 if((p.leg<.98&&garment==='remix')||(p.leg>=.98&&garment==='classic')){score+=7;why.push(garment==='remix'?'Tà ngắn tạo khoảng thoáng, làm rõ phần quần trên avatar.':'Tà dài tạo đường dọc rõ trên tỷ lệ avatar hiện tại.');}
 if(color.id===s.color){score+=8;why.push('Giữ màu bạn đang yêu thích.');}
 if(s.style==='minimal'&&['cream','jade','pink'].includes(color.id)){score+=5;why.push('Bảng màu dịu hợp phong cách tối giản đã chọn.');}
 if(s.style==='street'&&['lavender','blue'].includes(color.id)){score+=5;why.push('Sắc màu rõ nét hợp phong cách Street đã chọn.');}
 if(s.event==='wedding'&&color.id==='coral'){score-=8;why.push('Đỏ son: nên hỏi trước chủ tiệc về màu trang phục.');}
 if(s.accessories.length>3){look.accessories=s.accessories.slice(0,3);why.push('Giữ ba phụ kiện để điểm nhấn dễ đọc hơn.');}
 if(p.shoulder>1.08&&look.accessories.includes('scarf')){look.accessories=look.accessories.filter(x=>x!=='scarf');why.push('Bớt lớp khăn để đường cổ áo rõ hơn trên avatar.');}
 looks.push({look,score,reason:why.slice(0,3).join(' ')||'Một phương án phối khác để bạn so sánh.'});}
 return looks.sort((a,b)=>b.score-a.score).filter((v,i,a)=>a.findIndex(x=>x.look.color===v.look.color)===i).slice(0,3);
}
