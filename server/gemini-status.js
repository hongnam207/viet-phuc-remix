export function geminiStatus(status){
 if(status===429)return 'Gemini đang vượt hạn mức hoặc tạm giới hạn yêu cầu';
 if([400,401,403].includes(status))return 'Gemini chưa chấp nhận yêu cầu; cần kiểm tra khóa và quyền của dự án';
 if(status===404)return 'Model Gemini đang cấu hình chưa khả dụng cho dự án';
 return 'Gemini tạm thời chưa khả dụng';
}
