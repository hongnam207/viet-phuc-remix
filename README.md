# Việt phục Remix

Studio phối áo dài dành cho học sinh, sinh viên. Chọn sự kiện, kiểu áo, màu, phụ kiện; xoay avatar 3D, tạo avatar theo tỷ lệ từ ảnh toàn thân, đọc thông tin văn hóa và lưu lookbook.

## Chạy demo

Yêu cầu Node.js 20 trở lên. Cài các phụ thuộc từ lockfile trước khi dựng ứng dụng.

```sh
npm ci
npm run build
npm test
npm start
```

Mở http://localhost:4173. Mặc định gợi ý dựa trên quy tắc biên tập. Để gọi Gemini, đặt biến môi trường `GEMINI_API_KEY` ở máy chủ, tùy chọn `GEMINI_MODEL` (mặc định `gemini-3.5-flash-lite`), rồi khởi động lại. Không nhập khóa vào trình duyệt hoặc commit khóa. Trên Sites, cấu hình biến tương ứng bằng runtime secrets.

## Triển khai Render

`render.yaml` cấu hình Node Web Service ở Singapore, gói Free, build `npm ci --include=dev && npm run build`, start `npm start`, health check `/healthz`. Máy chủ đọc `PORT`, lắng nghe `0.0.0.0` và dùng `RENDER_EXTERNAL_URL` để xử lý Origin sau HTTPS proxy. Nếu service tạo thủ công, cần cập nhật Build Command trong Render Settings. Xem `docs/deploy-render.md`.

## Phạm vi demo

- Áo dài hiện đại và áo dài cách tân. Avatar 3D có ánh sáng, chất liệu và các tà áo; xoay, đổi trang phục, tải PNG/GLB. Đây là minh họa, không mô phỏng độ vừa hoặc phục dựng lịch sử.
- Bốn sự kiện; ba phong cách; sáu màu áo; ba màu quần; sáu phụ kiện; hai nhân vật.
- Bộ quy tắc luôn hoạt động. API Gemini chỉ gọi khi có khóa; trạng thái hiển thị rõ. Thông tin văn hóa và nguồn do ứng dụng quản lý.
- Chọn ảnh JPG/PNG/WebP tối đa 10 MB. MediaPipe Pose Landmarker chạy trong Web Worker, xử lý ảnh ngay trên thiết bị. Model và WASM được phục vụ cùng nguồn; phân tích tỷ lệ không gửi ảnh lên máy chủ. Luồng thử đồ trên ảnh bằng Gemini là lựa chọn riêng, chỉ gửi ảnh khi người dùng đồng ý và bấm tạo.
- Avatar từ ảnh là model tham số theo tỷ lệ vai/hông/chân ước lượng, không tái tạo khuôn mặt hay số đo thật. Có chỉnh thủ công và tự chọn màu da; không suy luận giới tính, sắc tộc hoặc tính hấp dẫn.
- Ba gợi ý phối dựa trên quy tắc sự kiện, phong cách và tỷ lệ avatar; không phải AI chấm điểm ngoại hình. Ảnh cá nhân không lưu trong lookbook hoặc URL chia sẻ. Tỷ lệ avatar được lưu cùng bản phối và có trong liên kết chia sẻ bộ sưu tập, với thông báo trên giao diện.
- Lookbook lưu ở trình duyệt; đặt tên, nhóm bộ sưu tập, so sánh ba look, xuất PNG, chia sẻ liên kết, sao lưu/khôi phục JSON. PNG lookbook cần 3D sẵn sàng; studio riêng vẫn có SVG dự phòng. Ảnh cá nhân và ảnh AI chỉ giữ trong phiên và có nút xóa.
- Avatar có chuyển động nhẹ, ba tư thế và chất liệu lụa/gấm/đũi minh họa; hiệu ứng tà áo bằng hình học, chưa mô phỏng vật lý vải/độ vừa. Gói 3D tải riêng khi đến studio; có chế độ tải nhẹ.
- Dự báo thật từ Open-Meteo cho năm thành phố, thư viện áo dài/ngũ thân/tứ thân có dẫn nguồn, danh bạ thuê/may theo thành phố và dịch vụ.
- Thử áo dài trên ảnh qua Gemini Image ở máy chủ; cần GEMINI_API_KEY có quyền dùng model tạo ảnh. Không có khóa thì báo chưa sẵn sàng, không giả lập kết quả. Xem docs/tinh-nang-mo-rong.md về cấu hình, hạn mức và nguồn.
- Chưa có dữ liệu chuyên gia hoặc nghiên cứu người dùng đã hoàn thành; ngũ thân/tứ thân chưa có mẫu 3D.
- Tủ đồ phụ kiện cá nhân, stylist trò chuyện, đối chiếu size từ số đo tự nhập, bản đồ văn hóa dạng sơ đồ, kiểm tra chi tiết phối; danh bạ thêm lọc kiểu áo/ngân sách và liên hệ.
- Cộng đồng Supabase: gửi bản phối chờ duyệt, lưu cảm hứng, chủ đề, báo cáo và quản trị. Cần cấu hình Supabase trước khi mở; không lưu cộng đồng trên ổ đĩa tạm của Render. Xem [hướng dẫn đầy đủ](docs/bo-tinh-nang-ca-nhan.md) và [schema SQL](docs/supabase-community.sql).

`src/`: giao diện và logic; `server/api.js`: Gemini; `scripts/`: đóng gói Worker và chạy local; `tests/`: kiểm thử; `docs/`: hồ sơ và kịch bản video.

Nguồn văn hóa: https://www.vietnam.travel/vi/things-to-do/all-about-ao-dai-vietnams-national-dress

Nguồn kỹ thuật: https://ai.google.dev/gemini-api/docs/structured-output

Nâng cấp 3D/ảnh sau bản Audition ngày 11/10/2026: xem `docs/nang-cap-3d.md`. Bản Render phục vụ riêng model/WASM từ `dist/public`; bản Sites cũ chưa nhận nâng cấp này.

Các cảnh báo là khuyến nghị của sản phẩm, không phải kết luận đúng/sai văn hóa. Cần người thực hành văn hóa rà soát trước khi mở rộng sang ngũ thân, tứ thân hoặc phục dựng theo địa phương.

Demo: https://viet-phuc-remix.onrender.com
Video: https://viet-phuc-remix.onrender.com/video
Repository: https://github.com/hongnam207/viet-phuc-remix

