# Việt phục Remix

Studio phối áo dài dành cho học sinh, sinh viên. Chọn sự kiện, kiểu áo, màu, phụ kiện; xem mockup SVG, thông tin văn hóa, so sánh và xuất lookbook.

## Chạy demo

Yêu cầu Node.js 20 trở lên. Không cần cài thư viện.

```sh
npm run build
npm test
npm start
```

Mở http://localhost:4173. Mặc định gợi ý dựa trên quy tắc biên tập. Để gọi Gemini, đặt biến môi trường `GEMINI_API_KEY` ở máy chủ, tùy chọn `GEMINI_MODEL` (mặc định `gemini-2.5-flash`), rồi khởi động lại. Không nhập khóa vào trình duyệt hoặc commit khóa. Trên Sites, cấu hình biến tương ứng bằng runtime secrets.

## Triển khai Render

`render.yaml` cấu hình Node Web Service ở Singapore, gói Free, build `npm run build`, start `npm start`, health check `/healthz`. Máy chủ đọc `PORT`, lắng nghe `0.0.0.0` và dùng `RENDER_EXTERNAL_URL` để xử lý Origin sau HTTPS proxy. Xem `docs/deploy-render.md`.

## Phạm vi demo

- Áo dài hiện đại và áo dài cách tân. SVG là minh họa, không mô phỏng chất liệu, số đo hoặc phục dựng lịch sử.
- Bốn sự kiện; ba phong cách; sáu màu áo; ba màu quần; sáu phụ kiện; hai nhân vật.
- Bộ quy tắc luôn hoạt động. API Gemini chỉ gọi khi có khóa; trạng thái hiển thị rõ. Thông tin văn hóa và nguồn do ứng dụng quản lý.
- Lookbook lưu ở trình duyệt; tải SVG, chia sẻ URL phối đồ. Không thu ảnh hay thông tin cá nhân.
- Chưa có thử đồ bằng ảnh, thời tiết trực tiếp, dữ liệu chuyên gia hoặc nghiên cứu người dùng đã hoàn thành.

`src/`: giao diện và logic; `server/api.js`: Gemini; `scripts/`: đóng gói Worker và chạy local; `tests/`: kiểm thử; `docs/`: hồ sơ và kịch bản video.

Nguồn văn hóa: https://www.vietnam.travel/vi/things-to-do/all-about-ao-dai-vietnams-national-dress

Nguồn kỹ thuật: https://ai.google.dev/gemini-api/docs/structured-output

Các cảnh báo là khuyến nghị của sản phẩm, không phải kết luận đúng/sai văn hóa. Cần người thực hành văn hóa rà soát trước khi mở rộng sang ngũ thân, tứ thân hoặc phục dựng theo địa phương.

Demo: https://viet-phuc-remix.onrender.com
Video: https://viet-phuc-remix.onrender.com/video
Repository: https://github.com/hongnam207/viet-phuc-remix

