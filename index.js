const express = require('express');                // Khởi tạo ứng dụng web với Express
const methodOverride = require('method-override'); // Cho phép gửi PUT/DELETE từ form HTML
const bodyParser = require('body-parser');         // Đọc dữ liệu từ form gửi lên (POST)
const cookieParser = require('cookie-parser');     // Đọc và xử lý cookie
const session = require('express-session');        // Quản lý phiên đăng nhập (session)
const flash = require('express-flash');            // Hiển thị thông báo tạm thời (flash message)
const path = require('path');                      // Xử lý đường dẫn hệ thống
const moment = require('moment');                  // Format thời gian


require('dotenv').config();                         // Load biến môi trường từ file .env
const route = require('./routes/client/index.route.js');   // Routes phía người dùng
const routeAdmin = require('./routes/admin/index.route.js'); // Routes phía quản trị
const database = require("./config/database.js");   // Kết nối CSDL
const systemConfig = require("./config/system.js"); // Cấu hình hệ thống (prefix, ...)

database.connect(); // Kết nối tới MongoDB 

const app = express();           // Tạo app Express
const port = process.env.PORT;  // Lấy PORT từ file .env

app.set("views",`${__dirname}/views`);      // Thư mục chứa file Pug (HTML động)
app.set("view engine", "pug");              // Engine hiển thị là Pug
app.use(express.static(`${__dirname}/public`)); // Thư mục chứa ảnh, CSS, JS


app.use(methodOverride('_method'));         // Cho phép dùng phương thức PUT/DELETE thông qua query ?_method=PUT
app.use(bodyParser.urlencoded({ extended: false })); // Đọc dữ liệu từ form HTML
app.use(cookieParser('LIIHERTZ'));          // Đọc cookie, có mã hóa với chuỗi `LIIHERTZ`

app.use(session({
    secret: 'LIIHERTZ',                     // Mã hóa session
    resave: false,                          // Không lưu lại session nếu không thay đổi
    saveUninitialized: false,              // Không tạo session nếu không có gì trong đó
    cookie: { maxAge: 60000 }              // Session sống trong 60 giây (1 phút)
}));

app.use(flash()); // Cho phép flash message (ví dụ: "Đăng nhập thành công")


app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce'))); //Truy cập /tinymce/... trên trình duyệt sẽ load từ node_modules/tinymce.

//App local variables
app.locals.prefixAdmin = systemConfig.prefixAdmin; // Ví dụ: '/admin'
app.locals.moment = moment;                        // Dùng moment trong Pug để định dạng thời gian

//Routes
route(app);       // Các route dành cho người dùng
routeAdmin(app);  // Các route dành cho admin
app.get("*", (req, res) => {
    res.render("client/pages/errors/404", {
    pageTitle: "404 Not Found",
    });
});

app.listen(port);