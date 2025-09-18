# Hệ thống điểm danh bằng nhận diện khuôn mặt

Ứng dụng web hiện đại cho việc điểm danh tự động sử dụng công nghệ nhận diện khuôn mặt AI.

## Tính năng chính

### Dành cho Giáo viên
- ✅ Tạo và quản lý lớp học
- ✅ Nhập danh sách sinh viên từ file Excel
- ✅ Theo dõi điểm danh thời gian thực
- ✅ Xuất báo cáo điểm danh ra Excel
- ✅ Xem ảnh khuôn mặt sinh viên sau khi điểm danh

### Dành cho Sinh viên
- ✅ Tham gia lớp bằng ID lớp
- ✅ Tạo khuôn mặt gốc để nhận diện
- ✅ Điểm danh tự động bằng camera
- ✅ Nghe thông báo bằng giọng nói AI tiếng Việt
- ✅ Xem phiếu điểm danh chi tiết

## Công nghệ sử dụng

- **Frontend**: React + TypeScript + Tailwind CSS
- **Nhận diện khuôn mặt**: Face-API.js với TensorFlow.js
- **Xử lý Excel**: SheetJS (xlsx)
- **Text-to-Speech**: Web Speech API
- **Lưu trữ**: LocalStorage (có thể mở rộng với database)

## Cài đặt và chạy

1. **Cài đặt dependencies**:
```bash
npm install
```

2. **Tải models nhận diện khuôn mặt**:
   - Tải các file model từ: https://github.com/justadudewhohacks/face-api.js/tree/master/weights
   - Đặt vào thư mục `/public/models/`
   - Các file cần thiết:
     - `tiny_face_detector_model-weights_manifest.json`
     - `tiny_face_detector_model-shard1`
     - `face_landmark_68_model-weights_manifest.json`
     - `face_landmark_68_model-shard1`
     - `face_recognition_model-weights_manifest.json`
     - `face_recognition_model-shard1`
     - `face_expression_model-weights_manifest.json`
     - `face_expression_model-shard1`

3. **Chạy ứng dụng**:
```bash
npm run dev
```

## Hướng dẫn sử dụng

### Cho Giáo viên

1. **Tạo lớp học**:
   - Chọn vai trò "Giáo viên"
   - Nhấn "Tạo lớp mới"
   - Điền thông tin lớp học
   - Tải lên file Excel hoặc thêm sinh viên thủ công

2. **Quản lý điểm danh**:
   - Chọn lớp cần quản lý
   - Theo dõi sinh viên điểm danh theo thời gian thực
   - Xuất báo cáo Excel khi cần

### Cho Sinh viên

1. **Tham gia lớp**:
   - Chọn vai trò "Sinh viên"
   - Nhập ID lớp do giáo viên cung cấp
   - Nhập MSSV của bạn

2. **Tạo khuôn mặt gốc**:
   - Chọn "Tạo khuôn mặt"
   - Nhìn thẳng vào camera và chụp ảnh

3. **Điểm danh**:
   - Chọn "Điểm danh"
   - Nhìn thẳng vào camera
   - Nghe thông báo thành công
   - Xem phiếu điểm danh

## Định dạng file Excel

### File nhập (danh sách sinh viên):
| STT | MSSV     | Tên           | Lớp    |
|-----|----------|---------------|--------|
| 1   | 20123456 | Nguyễn Văn A  | CNTT1  |
| 2   | 20123457 | Trần Thị B    | CNTT2  |

### File xuất (kết quả điểm danh):
| STT | MSSV     | Tên           | Lớp    | Trạng thái |
|-----|----------|---------------|--------|------------|
| 1   | 20123456 | Nguyễn Văn A  | CNTT1  | C          |
| 2   | 20123457 | Trần Thị B    | CNTT2  | V          |

## Lưu ý bảo mật

- Ảnh khuôn mặt được lưu trữ cục bộ
- Không có dữ liệu nào được gửi lên server
- Sử dụng HTTPS khi triển khai production
- Có thể mở rộng với database và mã hóa

## Hỗ trợ trình duyệt

- Chrome/Chromium (khuyến nghị)
- Firefox
- Safari
- Edge

**Lưu ý**: Cần cấp quyền truy cập camera và microphone.

## Phát triển thêm

- [ ] Tích hợp database (MongoDB/PostgreSQL)
- [ ] Xác thực và phân quyền
- [ ] API backend
- [ ] Mobile app
- [ ] Báo cáo thống kê nâng cao
- [ ] Tích hợp với hệ thống quản lý học tập

## Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng tạo issue hoặc pull request.

## Giấy phép

MIT License