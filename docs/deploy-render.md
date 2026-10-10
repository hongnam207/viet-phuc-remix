# Triển khai trên Render

Đã chuẩn bị `render.yaml` cho Node Web Service: build `npm run build`, start `npm start`, health check `/healthz`, lắng nghe `0.0.0.0` và `PORT` của Render. Chọn gói `free` để không tự động phát sinh gói trả phí.

## Cách triển khai

1. Đưa mã nguồn vào repository GitHub/GitLab/Bitbucket mà tài khoản Render có quyền đọc.
2. Trên Render tạo Blueprint từ repository; Render đọc `render.yaml`. Hoặc tạo Web Service, chọn Node, điền build/start/health check ở trên và chọn Free.
3. Nếu cần Gemini, thêm `GEMINI_API_KEY` dưới dạng secret trong Environment. Không đưa khóa vào repository. Không có khóa, gợi ý biên tập vẫn hoạt động.
4. Chờ deploy thành công, mở URL `onrender.com`, kiểm tra `/healthz`, giao diện, video `/video` và POST `/api/recommend` từ chính website.

Máy chủ dùng `RENDER_EXTERNAL_URL` do Render cấp để kiểm tra Origin chính xác sau HTTPS proxy. Không cần cơ sở dữ liệu. Lookbook lưu trong trình duyệt.

Nguồn: https://render.com/docs/deploy-node-express-app và https://render.com/docs/blueprint-spec

Chưa có URL Render được xác minh cho đến khi tài khoản Render được kết nối và repository được cung cấp.
