# Ứng Dụng Thương Mại Điện Tử - Demo Project

Một ứng dụng web thương mại điện tử được xây dựng bằng Node.js/Express.js với kiến trúc MVC hoàn chỉnh, tích hợp nhiều tính năng hiện đại.

## Mô Tả Tổng Quan

Dự án này là một nền tảng bán hàng trực tuyến đầy đủ tính năng, được thiết kế để hỗ trợ cả người dùng cuối và quản trị viên. Ứng dụng cung cấp trải nghiệm mua sắm trực tuyến mượt mà với giao diện thân thiện và hệ thống quản lý mạnh mẽ.

## Tính Năng Chính

### Phía Người Dùng
- **Đăng ký và Đăng nhập**: Hệ thống xác thực người dùng với mã hóa mật khẩu
- **Quên mật khẩu**: Khôi phục mật khẩu qua email với mã OTP
- **Duyệt sản phẩm**: Xem danh sách sản phẩm với phân trang và tìm kiếm
- **Chi tiết sản phẩm**: Thông tin chi tiết, hình ảnh và đánh giá sản phẩm
- **Giỏ hàng**: Thêm, xóa, cập nhật số lượng sản phẩm
- **Đặt hàng**: Quy trình thanh toán đơn giản và bảo mật
- **Chat trực tuyến**: Giao tiếp real-time với hỗ trợ khách hàng
- **Quản lý tài khoản**: Cập nhật thông tin cá nhân

### Phía Quản Trị
- **Dashboard**: Tổng quan thống kê hệ thống
- **Quản lý sản phẩm**: Thêm, sửa, xóa sản phẩm
- **Quản lý danh mục**: Tạo và quản lý phân loại sản phẩm
- **Quản lý tài khoản**: Quản lý người dùng và quản trị viên
- **Phân quyền**: Hệ thống vai trò và quyền hạn chi tiết
- **Cài đặt hệ thống**: Cấu hình chung của ứng dụng
- **Chat quản lý**: Hỗ trợ khách hàng qua chat

## Công Nghệ Sử Dụng

### Backend
- **Node.js**: Môi trường runtime JavaScript
- **Express.js**: Framework web server
- **MongoDB**: Cơ sở dữ liệu NoSQL
- **Mongoose**: ODM cho MongoDB

### Authentication & Security
- **MD5**: Mã hóa mật khẩu
- **Express-session**: Quản lý phiên đăng nhập
- **Cookie-parser**: Xử lý cookie

### Real-time Communication
- **Socket.io**: Chat thời gian thực

### File Handling
- **Multer**: Upload file
- **Cloudinary**: Lưu trữ và quản lý hình ảnh

### Template Engine
- **Pug**: Template engine để render HTML

### Email Service
- **Nodemailer**: Gửi email xác thực

### Development Tools
- **Nodemon**: Tự động restart server khi phát triển
- **Moment.js**: Xử lý thời gian
- **Method-override**: Hỗ trợ PUT/DELETE trong form HTML

## Cấu Trúc Thư Mục

```
Demo-Project/
├── config/              # Cấu hình ứng dụng
├── controllers/         # Logic xử lý business
│   ├── admin/          # Controllers cho admin
│   └── client/         # Controllers cho client
├── helpers/            # Các hàm tiện ích
├── middlewares/        # Middleware xử lý request
├── models/             # Schema cơ sở dữ liệu
├── public/             # File tĩnh (CSS, JS, images)
├── routes/             # Định nghĩa routes
├── sockets/            # Xử lý Socket.io
├── validates/          # Validation logic
├── views/              # Template Pug
└── uploads/            # File upload tạm thời
```

## Cài Đặt và Chạy

### Yêu Cầu Hệ Thống
- Node.js (phiên bản 14 trở lên)
- MongoDB
- NPM hoặc Yarn

### Cài Đặt
1. Clone repository:
```bash
git clone [repository-url]
cd Demo-Project
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file `.env` và cấu hình biến môi trường:
```env
PORT=3000
MONGO_URL=mongodb://localhost:27017/demo-project
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password
```

4. Chạy ứng dụng:
```bash
npm start
```

Ứng dụng sẽ chạy tại: http://localhost:3000

## Sử Dụng

### Người Dùng
- Truy cập trang chủ để duyệt sản phẩm
- Đăng ký tài khoản mới hoặc đăng nhập
- Thêm sản phẩm vào giỏ hàng và thanh toán
- Sử dụng chat để hỗ trợ

### Quản Trị Viên
- Truy cập `/admin` để vào panel quản trị
- Đăng nhập với tài khoản admin
- Quản lý sản phẩm, đơn hàng và người dùng

## Tính Năng Kỹ Thuật

### Bảo Mật
- Mã hóa mật khẩu với MD5
- Xác thực session-based
- Validation dữ liệu đầu vào
- CSRF protection

### Performance
- Pagination cho danh sách lớn
- Tối ưu hóa truy vấn database
- Caching với session
- Lazy loading cho hình ảnh

### Real-time Features
- Chat trực tiếp với Socket.io
- Thông báo real-time
- Cập nhật trạng thái online