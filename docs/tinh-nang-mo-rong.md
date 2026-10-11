# Việt phục Remix — tính năng mở rộng

Cập nhật sau hạn Audition, ngày 11/10/2026. Không dùng tài liệu này để khẳng định các tính năng đã có trong bài nộp trước hạn.

## Các luồng mới

- **Thử đồ trên ảnh:** chọn ảnh toàn thân, chọn bản phối, đọc thông báo gửi ảnh tới Google, đánh dấu đồng ý rồi tạo ảnh. Xem ảnh gốc và ảnh AI cạnh nhau, tải ảnh hoặc xóa kết quả. Ảnh được thu nhỏ tối đa 1280 px, chuyển JPEG, gửi qua `/api/tryon`. Ảnh không được ghi ra đĩa, lưu cơ sở dữ liệu hoặc ghi vào log của ứng dụng. Việc xử lý/lưu giữ phía Google tuân theo điều khoản Gemini API của tài khoản được dùng.
- **Avatar chuyển động:** bật chuyển động nhẹ của thân, tay và tà áo; chọn đứng thẳng hoặc thư thái. Tôn trọng cài đặt giảm chuyển động. Đây là hiệu ứng hình học, không phải mô phỏng vật lý vải hay xác nhận độ vừa.
- **Lookbook:** di chuyển dữ liệu cũ sang định dạng mới mà không xóa bản cũ; lưu trạng thái trang phục, tên, bộ sưu tập và tỷ lệ avatar. Tối đa 20 look; đặt tên, tạo nhóm, so sánh ba look, mặc lại, tải ảnh PNG, sao lưu/khôi phục JSON. Liên kết chia sẻ chứa lựa chọn và tỷ lệ avatar, không chứa ảnh cá nhân. Người nhận phải chọn lưu để thêm bộ sưu tập được chia sẻ vào thiết bị.
- **Gợi ý có lý do:** giữ giải thích theo sự kiện, phong cách, màu yêu thích và đường nét avatar. Gợi ý thời tiết nêu chất liệu/lớp khoác/phụ kiện phù hợp với nhiệt độ, khả năng mưa và gió. Không chấm điểm ngoại hình, không dự đoán trang phục vừa.
- **Thời tiết:** Hà Nội, Huế, Đà Nẵng, TP.HCM, Đà Lạt; chọn ngày trong hôm nay và 15 ngày tiếp theo. Máy chủ truy vấn Open-Meteo và lưu đệm 30 phút; không yêu cầu GPS. Lỗi dữ liệu được hiển thị, không thay bằng dự báo giả.
- **Thư viện Việt phục:** ba mục áo dài, áo ngũ thân, áo tứ thân; lọc theo vùng, xem đặc điểm và ngữ cảnh, đọc nguồn. Chỉ áo dài hiện đại có mẫu thử trong studio. Hình biểu tượng là thiết kế minh họa, không phải bản phục dựng cấu trúc lịch sử.
- **Nơi thuê/may:** lọc thành phố và dịch vụ, xem cửa hàng, địa chỉ/bản đồ, giá tham khảo có ngày kiểm tra. Sao chép mô tả phối đồ để người dùng tự hỏi cửa hàng. Không đặt hàng, không xác nhận tồn kho/size và không nhận hoa hồng.

## Cấu hình Render

Trong Environment của dịch vụ, thêm `GEMINI_API_KEY`. Không đưa khóa vào mã nguồn, chat, URL hoặc ảnh chụp minh chứng. Khóa được dùng trên máy chủ cho cả gợi ý văn bản và tạo ảnh. Chỉ cần cài đặt một lần; giao diện tạo ảnh kiểm tra `/api/capabilities` và có nút kiểm tra lại.

- `GEMINI_IMAGE_MODEL`: mặc định `gemini-2.5-flash-image`, có thể đổi sang model tạo ảnh có hỗ trợ GenerateContent trong dự án.
- `TRYON_DAILY_LIMIT`: mặc định 30 yêu cầu tạo ảnh/ngày cho toàn dịch vụ, tối đa 5 yêu cầu/IP/ngày và hai yêu cầu đang xử lý cùng lúc. Tính cả lần lỗi upstream; bộ đếm nằm trong RAM, đặt lại khi dịch vụ khởi động hoặc sang ngày UTC. Với dịch vụ nhiều instance hoặc yêu cầu hạn mức bền vững, cần chuyển sang bộ đếm lưu trữ và xác thực tài khoản. Thiết lập ngân sách phía Google là kiểm soát chi phí độc lập.
- Không cấu hình khóa thì luồng tạo ảnh báo chưa sẵn sàng, không tạo ảnh giả. Các chức năng avatar, lookbook, thư viện, danh bạ và thời tiết hoạt động độc lập.

## Nguồn đối chiếu ngày 11/10/2026

- Gemini: https://ai.google.dev/gemini-api/docs/generate-content/image-generation và https://ai.google.dev/gemini-api/docs/models/gemini-2.5-flash-image — ảnh đầu vào inlineData, ảnh trả về trong candidates/parts, TEXT + IMAGE.
- Open-Meteo: https://open-meteo.com/en/docs — dự báo theo tọa độ, nhiệt độ min/max, xác suất mưa, gió tối đa; ghi công CC BY 4.0 trên giao diện. API miễn phí dùng cho demo phi thương mại.
- Áo dài và ngũ thân: https://vietnam.travel/node/1216 — Vietnam Tourism.
- Trang phục truyền thống và tứ thân: https://vietnamtourism.vn/index.php/about/items/2258 — Cục Du lịch Quốc gia Việt Nam. Không dùng suy luận của AI làm nguồn văn hóa.
- La Sen Vũ: https://aodailasenvu.com.vn/ — tự giới thiệu may đo, bán sẵn, cho thuê; địa chỉ Thái Hà, Hà Nội. Giá tùy mẫu/dịch vụ.
- Nhi Nhi: https://cophucnhinhi.com/ — cho thuê áo dài/cổ phục tại Huế, địa chỉ 27 Trần Nguyên Hãn.
- HiZu: https://hizu.com.vn/products/cho-thue-ao-dai-trang-quan-trang-huong-boutique — mẫu trắng HUONG Boutique, giá thuê 1.260.000đ, cọc 5.060.000đ tại thời điểm kiểm tra; địa chỉ 221B Trần Huy Liệu, TP.HCM. Không gán mẫu trắng này là bản phối màu kem chính xác.

## Kiểm tra

`npm run build` và `npm test`: 19 kiểm tra, gồm dữ liệu văn hóa/phối đồ cũ, GLB có texture, adapter Render, luồng consent/origin/kích thước JPEG, phản hồi Gemini qua mock, dự báo qua mock, di chuyển/chia sẻ lookbook. Kiểm tra phản hồi thật Open-Meteo trên bản chạy local. Kiểm tra UI: lưu look thứ ba, so sánh, tải PNG thực, chuyển động/tư thế, các tab và bộ lọc.

Tạo ảnh Gemini thật cần khóa có quyền dùng model và hạn mức; không coi mock là minh chứng tạo ảnh thật. Dữ liệu cá nhân không được dùng làm ảnh kiểm thử gửi tới Google nếu chưa có sự đồng ý cụ thể.
