# Triển khai trên Render

Đã chuẩn bị `render.yaml` cho Node Web Service: build `npm run build`, start `npm start`, health check `/healthz`, lắng nghe `0.0.0.0` và `PORT` của Render. Chọn gói `free` để không tự động phát sinh gói trả phí.

## Cách triển khai

1. Đưa mã nguồn vào repository GitHub/GitLab/Bitbucket mà tài khoản Render có quyền đọc.
2. Trên Render tạo Blueprint từ repository; Render đọc `render.yaml`. Hoặc tạo Web Service, chọn Node, điền build/start/health check ở trên và chọn Free.
3. Nếu cần Gemini, thêm `GEMINI_API_KEY` dưới dạng secret trong Environment. Không đưa khóa vào repository. Không có khóa, gợi ý biên tập vẫn hoạt động.
4. Chờ deploy thành công, mở URL `onrender.com`, kiểm tra `/healthz`, giao diện, video `/video` và POST `/api/recommend` từ chính website.

Máy chủ dùng `RENDER_EXTERNAL_URL` do Render cấp để kiểm tra Origin chính xác sau HTTPS proxy. Lookbook cá nhân lưu trong trình duyệt. Cộng đồng cần Supabase; xem `docs/bo-tinh-nang-ca-nhan.md` và `docs/supabase-community.sql`.

Nguồn: https://render.com/docs/deploy-node-express-app và https://render.com/docs/blueprint-spec

Đã triển khai và xác minh Live ngày 10/10/2026: https://viet-phuc-remix.onrender.com. Repository: https://github.com/hongnam207/viet-phuc-remix. Service ID: srv-db56nhnavr4c73flca20. Video: https://viet-phuc-remix.onrender.com/video. Chưa cấu hình GEMINI_API_KEY, gợi ý biên tập hoạt động và có nhãn rõ. Gói Free có thể khởi động chậm sau thời gian không truy cập.

