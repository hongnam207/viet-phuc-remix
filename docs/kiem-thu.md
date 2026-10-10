# Biên bản kiểm thử demo

Ngày: 10/10/2026. Môi trường local Node.js, trình duyệt Codex.

- 9 kiểm thử tự động đạt: chuẩn hóa dữ liệu ngoài danh mục; 48 tổ hợp kiểu áo/sự kiện/màu; lưu ý bối cảnh; prompt/schema; API không khóa; đầu vào lỗi; nhánh Gemini thành công và phản hồi lỗi bằng giả lập.
- Worker đóng gói hợp lệ, có default.fetch.
- Trình duyệt xác nhận đổi màu/kiểu áo/phụ kiện cập nhật mockup; cảnh báo đỏ son/dự cưới xuất hiện; khi không có khóa ghi rõ chưa kết nối Gemini.
- Lưu hai look, mở dialog và so sánh hai phương án thành công.
- Tải SVG thành công. Sao chép URL và mở lại khôi phục lựa chọn.
- Kiểm tra bố cục desktop 1440 và mobile 390; mobile không tràn ngang (clientWidth và scrollWidth đều 375, đã trừ thanh cuộn).
- Không có lỗi/warning trong console tại thời điểm kiểm tra.

Ảnh minh chứng trong `docs/evidence/`. Chưa kiểm tra Gemini qua mạng bằng khóa thật; chưa có đánh giá chuyên gia văn hóa hoặc người dùng đại diện.


Triển khai Render ngày 10/10/2026: trạng thái Live, health 200, API 200 với Origin HTTPS của Render, video range 206. Đã kiểm tra thay màu và nhấn gợi ý từ trình duyệt trên URL thật. Tổng kiểm thử tự động hiện tại: 10/10 đạt (thêm kiểm thử máy chủ Render).

