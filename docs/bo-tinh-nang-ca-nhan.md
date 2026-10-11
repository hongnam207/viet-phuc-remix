# Bộ tính năng cá nhân — 11/10/2026

## Đã triển khai

1. Thử áo dài trên ảnh: xử lý ảnh thu nhỏ, đồng ý gửi đến Google, giới hạn lượt tạo, hủy chờ và tải ảnh. Cần khóa Gemini có quyền tạo ảnh; không tạo kết quả giả khi chưa có khóa.
2. Tủ đồ: thêm/xóa tối đa 40 phụ kiện, gợi ý ba cách dùng đồ đang có, sao lưu và khôi phục JSON. Lưu cục bộ.
3. Stylist: trò chuyện nhiều lượt, ba bản phối áp dụng vào studio, dùng sở thích và phụ kiện trong tủ. Gemini ở máy chủ, có bộ quy tắc dự phòng và trạng thái rõ ràng. Không lưu trò chuyện qua tải lại trang.
4. Chất liệu/chuyển động: lụa/gấm/đũi có khác biệt roughness, sheen, bump texture và biên độ tà áo; tư thế đứng, thư thái và bước đi nhẹ tại chỗ. Đây là hiệu ứng hình học, chưa phải mô phỏng vật lý vải hay chuyển động người được motion capture.
5. Size: đối chiếu chiều cao/ngực/eo/hông do người dùng nhập với bảng minh họa S–XL; thể hiện trường hợp nằm ngoài bảng và thông tin tỷ lệ avatar nếu người dùng chọn. Không suy ra vòng cơ thể hoặc cam kết độ vừa từ một ảnh. Bảng size của demo không đại diện cửa hàng nào.
6. Bản đồ: sơ đồ chọn Bắc Bộ, Huế/Đàng Trong và cả nước; nội dung áo tứ thân/ngũ thân/áo dài, bối cảnh và dẫn nguồn. Sơ đồ không thể hiện địa giới, không gán niên đại chưa kiểm chứng.
7. Kiểm tra phối: đặc điểm nhận biết, chi tiết cách tân và lưu ý sự kiện; theo lựa chọn hiện tại. Không kết luận đúng/sai văn hóa cho mọi bối cảnh.
8. Cộng đồng: API Supabase, gửi bản phối chờ duyệt, chỉ đọc bài được duyệt, ba chủ đề, lưu cảm hứng cục bộ, báo cáo và trang quản trị duyệt/ẩn. Không đăng ảnh cá nhân; tên hiển thị là tên tự chọn, chưa có xác minh danh tính. Chưa mở công khai khi Supabase chưa cấu hình.
9. Thuê/may: lọc thành phố/dịch vụ/kiểu áo/ngân sách; tùy chọn gồm nơi chưa báo giá, dẫn nguồn, bản đồ, gọi điện ở nơi có số đã đối chiếu và sao chép yêu cầu. Không có tồn kho hoặc giá trực tiếp. Dữ liệu từ website cửa hàng đã đối chiếu ngày 11/10/2026.
10. Tải nhanh: chia gói JavaScript, tải Three.js và model khi studio xuất hiện; chế độ tải nhẹ chỉ tải 3D khi người dùng bấm mở hoặc yêu cầu xuất lookbook PNG. Phân tích ảnh tiếp tục tải AI khi được yêu cầu.

## Mở Gemini và cộng đồng

Trong Render > Environment, thêm các giá trị sau. Không gửi khóa vào chat hoặc commit repository.

| Biến | Giá trị |
| --- | --- |
| GEMINI_API_KEY | Khóa dự án Google có quyền gọi model tạo ảnh |
| GEMINI_MODEL | gemini-3.5-flash-lite hoặc model văn bản có quyền sử dụng |
| GEMINI_IMAGE_MODEL | gemini-2.5-flash-image hoặc model tạo ảnh tương thích |
| TRYON_DAILY_LIMIT | 30 mặc định, điều chỉnh theo ngân sách dự án |
| SUPABASE_URL | URL HTTPS của dự án, dạng https://PROJECT.supabase.co, không có dấu / cuối |
| SUPABASE_SECRET_KEY | Secret key mới của Supabase; có hỗ trợ khóa service_role cũ |
| COMMUNITY_ADMIN_TOKEN | Chuỗi ngẫu nhiên tối thiểu 24 ký tự; chỉ quản trị viên giữ |

1. Tạo dự án Supabase trong tài khoản của đội.
2. Chạy file [supabase-community.sql](supabase-community.sql) một lần trong SQL Editor. Hai bảng bật RLS; không cấp quyền anon/authenticated. Máy chủ xác thực và lọc dữ liệu trước khi gọi REST API bằng secret.
3. Thêm biến vào Render và lưu/deploy lại. API `/api/capabilities` chỉ trả boolean, không trả khóa.
4. Trong tab Cộng đồng, gửi một bản phối. Mở phần quản trị, nhập khóa quản trị và duyệt. Kiểm tra bài xuất hiện với trình duyệt khác; gửi báo cáo và ẩn bài để xác minh luồng.
5. Nếu Google/Supabase từ chối hoặc chưa phản hồi, ứng dụng hiển thị lỗi hoặc dùng bộ quy tắc; không báo thành công khi chưa lưu/gọi được dịch vụ.

Giới hạn gửi bài 5/giờ và báo cáo 10/giờ theo địa chỉ máy khách, giới hạn nằm trong bộ nhớ từng tiến trình; khởi động lại sẽ đặt lại. Đây là lớp chống spam cơ bản cho demo. Muốn vận hành cộng đồng rộng cần bổ sung Supabase Auth, giới hạn phân tán và quy trình kiểm duyệt có người phụ trách.

## Kiểm tra

`npm run build` rồi `npm test`. Kiểm thử gồm kích cỡ, giới hạn dữ liệu, gợi ý tủ đồ, đầu ra stylist, nguồn yêu cầu, trạng thái chưa cấu hình, luồng lưu/duyệt/báo cáo với REST mock và tách gói 3D. Mock không chứng minh Google hay Supabase đã được kết nối ngoài thực tế.

Nguồn kỹ thuật: [Gemini API](https://ai.google.dev/api/generate-content), [Supabase REST](https://supabase.com/docs/guides/api), [Supabase API keys](https://supabase.com/docs/guides/getting-started/api-keys), [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).

Nguồn danh bạ: [La Sen Vũ](https://aodailasenvu.com.vn/), [Nhi Nhi](https://cophucnhinhi.com/), [HiZu](https://hizu.com.vn/products/cho-thue-ao-dai-trang-quan-trang-huong-boutique).

Model văn bản mặc định cập nhật sang gemini-3.5-flash-lite theo khuyến nghị cho dự án mới trong [lịch vòng đời model của Google](https://ai.google.dev/gemini-api/docs/deprecations/). Không bật billing hoặc nâng cấp gói khi đổi model. API vẫn phụ thuộc quyền và hạn mức của dự án.
