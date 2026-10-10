# Hồ sơ dự thi — Việt phục Remix

Trạng thái: Bản nháp để đội rà soát. Hạn nộp: 10/10/2026, 23:59:59 (Asia/Ho_Chi_Minh). Nội dung dưới đây mô tả tính năng đã triển khai; không khẳng định đã khảo sát người dùng, được chuyên gia xác nhận hoặc chạy Gemini với khóa thật.

## I. Thông tin giải pháp

### Tên giải pháp

Việt phục Remix

### Nhu cầu người dùng và tình huống sử dụng

Học sinh, sinh viên muốn mặc áo dài trong dịp du xuân, chụp kỷ yếu, ngày hội văn hóa hoặc dự lễ cưới nhưng thường chưa biết lựa chọn màu và phụ kiện phù hợp. Họ muốn thể hiện cá tính, xem trước tổng thể và hiểu đâu là sáng tạo hiện đại, đâu là thông tin văn hóa cần tham khảo.

Giải pháp tập trung vào áo dài hiện đại và áo dài cách tân. Người dùng có thể thử nhiều bản phối trước khi tìm mua, thuê hoặc chuẩn bị trang phục. Khi phối cho một sự kiện, ứng dụng đưa ra lưu ý theo bối cảnh, chẳng hạn kiểm tra quy định của trường hoặc hỏi chủ tiệc về màu trang phục. Các nhận định về nhu cầu là giả thuyết thiết kế cần tiếp tục xác minh qua phỏng vấn và thử nghiệm người dùng.

### Tóm tắt giải pháp

Việt phục Remix là studio phối áo dài trên web với thông điệp “Tà áo quen. Chất riêng mới.” Người dùng chọn một trong bốn sự kiện, kiểu áo, màu áo, màu quần, phong cách và phụ kiện. Mockup nhân vật cập nhật ngay khi thay đổi lựa chọn, giúp người dùng thấy tổng thể mà không cần tải ảnh cá nhân.

Demo có hai kiểu áo, sáu màu áo, ba màu quần, ba phong cách, sáu phụ kiện và hai nhân vật đại diện. Ba bản phối mẫu giúp người mới bắt đầu nhanh. Bên cạnh hình minh họa là thẻ gợi ý phối và thông tin ngắn về áo dài, kèm nguồn tham khảo. Lưu ý theo sự kiện nhắc người dùng cân nhắc ngữ cảnh thay vì gán nhãn “đúng/sai văn hóa”.

Người dùng lưu tối đa 20 look trên trình duyệt, chọn hai look để so sánh, tải mockup SVG và sao chép liên kết chứa bản phối. API Gemini được triển khai để tạo lời gợi ý cá nhân hóa khi máy chủ được cấu hình khóa. Nếu chưa có khóa hoặc AI trả lỗi, demo hiển thị rõ đang dùng gợi ý từ bộ quy tắc.

Mockup là minh họa thiết kế, không phải thử đồ theo số đo hay phục dựng lịch sử. Demo chưa hỗ trợ tải ảnh và thời tiết trực tiếp.

### Tác động kỳ vọng

Với người dùng, sản phẩm kỳ vọng giảm sự lúng túng khi chọn áo dài, hỗ trợ thử màu và phụ kiện nhanh, đồng thời khuyến khích đọc thêm thông tin văn hóa trước khi sử dụng trang phục. Với cộng đồng, lookbook và liên kết phối đồ có thể giúp người trẻ chia sẻ ý tưởng và thảo luận về cách đưa áo dài vào đời sống.

Về bảo tồn và phát huy văn hóa, sản phẩm tạo điểm tiếp cận gần gũi với áo dài, phân biệt hình minh họa sáng tạo với tư liệu lịch sử và đặt nguồn tham khảo bên cạnh thông tin văn hóa. Sản phẩm không thay thế người thực hành văn hóa hoặc chuyên gia.

Đội dự kiến đánh giá bằng một vòng thử nghiệm với học sinh, sinh viên: khả năng tự hoàn thành một bản phối, thời gian thực hiện, mức độ hiểu các lưu ý và phản hồi về độ hữu ích. Đội cũng dự kiến mời người thực hành văn hóa rà soát nội dung trước khi mở rộng sang áo ngũ thân, tứ thân hoặc phục dựng theo địa phương. Đây là kế hoạch đánh giá, chưa phải tác động hoặc kết quả đã đo lường.

### Hướng tiếp cận và giải pháp kỹ thuật

Ứng dụng gồm giao diện web HTML/CSS/JavaScript, mô hình trạng thái phối đồ và API phía máy chủ. Giao diện đáp ứng màn hình máy tính và điện thoại. Không cần thư viện phía client hay tài khoản để thử phối.

Dữ liệu được tổ chức thành danh mục kiểu áo, sự kiện, màu và phụ kiện có mã định danh. Mọi lựa chọn từ giao diện, URL và lookbook được chuẩn hóa theo danh mục cho phép. Mockup SVG được dựng từ trạng thái hiện tại: thay đổi màu vải, độ dài tà và các lớp phụ kiện. Hai nhân vật là minh họa và không suy luận giới tính người dùng.

Luồng xử lý: người dùng chọn → chuẩn hóa trạng thái → cập nhật SVG → chạy quy tắc gợi ý và lưu ý → hiển thị thông tin văn hóa đã biên tập. Khi nhấn “Nhờ Gemini gợi ý”, trình duyệt gửi POST /api/recommend. Máy chủ tạo prompt từ danh mục và trạng thái, gọi Gemini REST với JSON schema, kiểm tra đầu ra rồi trả nội dung gợi ý. Các lưu ý theo bối cảnh luôn lấy từ bộ quy tắc, không bị AI ghi đè. Nếu người dùng đổi lựa chọn trong lúc chờ, giao diện bỏ qua phản hồi cũ.

Lookbook sử dụng localStorage của trình duyệt. Liên kết chia sẻ chứa trạng thái phối đồ trong query string; người mở nhận lại đúng các lựa chọn hợp lệ. Nút tải xuất SVG độc lập. Dữ liệu không được đồng bộ giữa thiết bị.

Máy chủ local chạy bằng Node.js; bản đóng gói là một Cloudflare Worker ESM chứa giao diện và API để triển khai trên Sites. Khóa Gemini chỉ đọc từ biến môi trường máy chủ. API kiểm tra phương thức, nguồn yêu cầu và giới hạn độ dài đầu vào, có timeout; giao diện đưa nội dung AI vào textContent. Chính sách bảo mật nội dung hạn chế script và kết nối từ client về cùng nguồn.

Đã có kiểm thử tự động cho chuẩn hóa dữ liệu, các tổ hợp sự kiện/màu/kiểu áo, lưu ý bối cảnh, prompt, schema và xử lý lỗi API. Nhánh Gemini thành công được kiểm thử bằng phản hồi giả lập. Chưa xác minh cuộc gọi Gemini thực tế do chưa có khóa API. Trước vận hành rộng cần bổ sung hạn mức bền vững phía máy chủ và giám sát chi phí.

## II. Ứng dụng Gemini & Prompting

### Cách sử dụng Gemini

Gemini đảm nhận việc diễn đạt lời gợi ý phối đồ từ lựa chọn cụ thể của người dùng. Đầu vào gồm kiểu áo, sự kiện, màu áo/quần, phong cách, nhân vật và phụ kiện đã chọn, kèm từ điển danh mục và đoạn ngữ cảnh văn hóa do đội biên tập. Không gửi ảnh, tên, số đo hoặc dữ liệu cá nhân.

API dùng phương thức generateContent và yêu cầu JSON gồm title, description, tips. Mô hình mặc định trong mã là gemini-2.5-flash; có thể cấu hình GEMINI_MODEL ở máy chủ. temperature đặt 0,4. Máy chủ kiểm tra độ dài và kiểu dữ liệu, rồi kết hợp gợi ý với các lưu ý từ bộ quy tắc. Gemini không tạo hình trong bản demo; hình kết quả là mockup SVG do ứng dụng dựng.

Gemini không được dùng làm nguồn xác nhận lịch sử, nghi lễ hay kết luận về tính phù hợp văn hóa. Thẻ thông tin áo dài dẫn nguồn Vietnam Tourism và giữ nguyên khi AI trả lời. Người dùng được nhắc kiểm tra quy định thực tế của trường hoặc ban tổ chức sự kiện.

Trạng thái hiện tại: đã triển khai mã tích hợp và kiểm thử bằng phản hồi giả lập; chưa có GEMINI_API_KEY nên bản chạy dùng gợi ý biên tập. Đội cần cấu hình khóa và kiểm tra một cuộc gọi thật trước khi trình bày rằng Gemini đang hoạt động trực tiếp. Việc xây dựng demo trong phiên này thực hiện bằng Codex; không thể dùng phiên này thay cho liên kết cuộc trò chuyện Gemini theo yêu cầu đề thi.

### Chiến lược và quy trình prompting

Prompt được chia theo nhiệm vụ, ràng buộc và dữ liệu. Phần nhiệm vụ xác định trợ lý phối áo dài cho học sinh, sinh viên, dùng tiếng Việt ngắn gọn. Phần ràng buộc yêu cầu chỉ đề xuất thẩm mỹ theo lựa chọn, không bịa nguồn gốc/niên đại/nghi lễ, không suy luận giới tính hoặc vóc dáng, không gán nhãn đúng/sai văn hóa và không thêm phụ kiện ngoài lựa chọn. Phần dữ liệu chứa JSON đã chuẩn hóa cùng từ điển danh mục, ngữ cảnh biên tập.

Đầu ra bị ràng buộc bởi schema title/description/tips. Ứng dụng kiểm tra title tối đa 80 ký tự, description tối đa 350 ký tự và 2–3 tips, mỗi tip tối đa 200 ký tự. Kết quả sai cấu trúc, bị chặn, lỗi mạng hoặc timeout sẽ chuyển về gợi ý biên tập có nhãn rõ. Nội dung được hiển thị như văn bản; không chèn HTML do mô hình trả về.

Đã kiểm thử việc lọc lựa chọn không hợp lệ, loại bỏ dữ liệu ngoài danh mục, phát hiện đầu ra sai schema và giữ nguyên lưu ý bối cảnh sau phản hồi Gemini giả lập. Các ca rà soát thủ công được đề xuất gồm: đỏ son khi dự cưới; cách tân/sneaker khi dự nghi lễ; kỷ yếu có quy định trường; nhiều phụ kiện; yêu cầu AI đưa kết luận lịch sử chưa có nguồn.

Đội dự kiến chạy các ca này trên Gemini thật, chấm theo bốn tiêu chí: bám lựa chọn, hữu ích, không bịa thông tin văn hóa và ngắn gọn. Sau đó sửa prompt theo lỗi quan sát được, lưu ví dụ trước/sau và kiểm tra lại. Đây là quy trình cải tiến đề xuất; chưa có dữ liệu chứng minh đã thực hiện vòng tối ưu với Gemini thật. Ràng buộc prompt giảm rủi ro nhưng không bảo đảm mọi câu trả lời đúng về văn hóa; cần rà soát con người.

## III. Minh chứng

### URL video giới thiệu

Chờ cập nhật sau khi xuất bản video. Video được dựng từ ảnh chụp các trạng thái thực của demo, có chú thích, không có lời thoại. Không phải bản ghi thao tác liên tục.

### URL demo

https://viet-phuc-remix-arena.t-rue0802370923999.chatgpt.site

Chỉ dùng URL này sau khi xác nhận triển khai thành công.

### URL repository

Chưa có repository GitHub do đội cung cấp. Mã nguồn hoàn chỉnh ở thư mục dự án và được đồng bộ vào kho nguồn Sites khi xuất bản. Cần repository truy cập được với ban giám khảo; không dùng liên kết ZIP thay cho repository nếu đề thi yêu cầu kho mã nguồn.

### URL chia sẻ cuộc trò chuyện với Gemini

Chưa có. Đội cần thực hiện cuộc trò chuyện thực tế trên Gemini, kiểm tra nội dung trước khi chia sẻ và dán liên kết chia sẻ vào trường này. Không tạo liên kết minh chứng giả.

## Cam kết để đội rà soát

Đội mô tả trung thực phạm vi demo, phân biệt tính năng đã triển khai với kế hoạch mở rộng. Đội không tuyên bố đã khảo sát, được chuyên gia chứng thực hoặc chạy Gemini thật khi chưa có minh chứng. Các bản phối là gợi ý sáng tạo; người dùng cần kiểm tra ngữ cảnh thực tế. Đội dẫn nguồn nội dung văn hóa, không sử dụng ảnh cá nhân trong demo và bảo vệ khóa API ở phía máy chủ. Thành viên đội cần đọc, xác nhận và chịu trách nhiệm về cam kết trước khi nộp bài.

## Nguồn

- Vietnam Tourism: https://www.vietnam.travel/vi/things-to-do/all-about-ao-dai-vietnams-national-dress
- Google AI for Developers, structured output: https://ai.google.dev/gemini-api/docs/generate-content/structured-output
