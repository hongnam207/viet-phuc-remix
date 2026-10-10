# Nâng cấp thử đồ 3D — 11/10/2026

Bản nâng cấp sau hạn Audition; không sửa hồi tố các tuyên bố/minh chứng của bản nộp ngày 10/10/2026. Demo hiện tại: https://viet-phuc-remix.onrender.com

## Tính năng

- Three.js: avatar 3D với khuôn mặt, tóc dài/ngắn tự chọn, tay/ngón tay, áo dài có cổ/sleeve/hai tà, quần và phụ kiện. Xoay/kéo, góc trước/nghiêng/sau, chất liệu vải và ánh sáng studio. Segoe UI giữ nguyên.
- Tải ảnh toàn thân JPG, PNG hoặc WebP (tối đa 10 MB), xem ảnh và chủ động bấm phân tích. MediaPipe Pose Landmarker lite nhận diện 33 điểm dáng người trong Web Worker CPU.
- Kiểm tra một người, độ hiển thị, chân không bị cắt, chính diện và tư thế đứng. Khi ảnh không phù hợp không dựng avatar giả; người dùng được hướng dẫn chụp lại hoặc chỉnh thủ công.
- Tỷ lệ khoảng cách vai, hông, chân được chuẩn hóa tương đối với thân và giới hạn phạm vi hình học. Các điểm hông là khớp, không phải đường viền cơ thể; đây là ước lượng để minh họa, không đo vòng hông/chiều cao hoặc dựng người chính xác.
- Avatar tham số thay đổi theo kết quả. Có ba thanh chỉnh tỷ lệ và màu da tự chọn. Không sao chép mặt, suy luận giới tính, sắc tộc, cân nặng hoặc điểm hấp dẫn.
- Xếp ba bản phối theo quy tắc đã viết: sự kiện/phong cách/màu ưa thích và đường nét trên avatar. Mỗi lựa chọn có lý do; chọn “Thử trên avatar” để áp dụng ngay. Thứ tự không khẳng định kiểu trang phục nào đẹp nhất khách quan hay vừa với số đo.
- Tải ảnh PNG và model GLB 2.0 có cả avatar/trang phục. Nếu thiết bị không hỗ trợ WebGL, giữ minh họa SVG và tắt xuất GLB.

## Dữ liệu và triển khai

Ảnh không gửi lên máy chủ hoặc Gemini. Thư viện AI, WASM, model và ứng dụng được tải từ cùng nguồn Render. Worker nhận ImageBitmap, giải phóng sau xử lý. Ảnh được giữ bằng blob URL trong phiên; nút xóa hủy worker, URL và kết quả. Không lưu ảnh/tỷ lệ vào localStorage, URL chia sẻ hoặc kho mã nguồn.

`scripts/build.mjs` dùng esbuild đóng gói Three.js và worker AI; sao chép WASM từ package đúng phiên bản và model vào `dist/public`. Node chỉ phục vụ các tên tài nguyên AI cho phép, kiểu MIME chính xác. CSP cho phép thực thi WASM cùng nguồn; không nới sang script hoặc kết nối bên ngoài. Gemini API cũ giữ nguyên, vẫn chưa có khóa thật.

Các tài liệu/clip Audition trong thư mục docs mô tả bản cũ. Bản Sites cũ chưa có các tài nguyên AI của bản Render. Không khẳng định clip cũ có tính năng mới.

## Kiểm chứng

- Bộ 13 kiểm thử tự động: danh mục, API và fallback, Node/HTTPS Render, video, tỷ lệ ảnh, loại bỏ người/ảnh không hợp lệ, khống chế tham số và xếp gợi ý hợp lệ.
- Thử AI thật trong trình duyệt với ảnh kiểm thử công khai `male_full_height_hands.jpg` của MediaPipe: nhận diện một người, tạo avatar và ba thẻ phối 3D, áp dụng một gợi ý rồi xoay model.
- Xuất GLB thực tế: kiểm tra header glTF, phiên bản 2, 96 meshes/10 materials trong bản thử mẫu.
- Ảnh fixture kiểm thử chỉ nằm trong thư mục tạm, không đưa vào repo hoặc dùng làm ảnh người dùng mẫu.

## Nguồn và giấy phép

- Three.js (MIT): https://threejs.org/docs/pages/OrbitControls.html ; văn bản giấy phép: assets/THREE-LICENSE.txt.
- MediaPipe Tasks Vision (Apache-2.0): https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker/web_js
- Model lite từ liên kết chính thức: https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task
- Fixture chính thức được khai báo tại: https://github.com/google-ai-edge/mediapipe/blob/master/third_party/external_files.bzl

Một ảnh không cho đủ dữ liệu để dựng bề mặt cơ thể chính xác hoặc kiểm chứng độ vừa của vải. Để nâng thành thử đồ chuyên nghiệp cần thêm dữ liệu nhiều góc/số đo và model trang phục cùng hệ mô phỏng được kiểm định.
