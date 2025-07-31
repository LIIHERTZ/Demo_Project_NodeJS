const User = require("../../models/user.model.js");
const Cart = require("../../models/cart.model.js");
const ForgotPassword = require("../../models/forgot-password.model.js");
const md5 = require("md5");
const generateHelper = require("../../helpers/generate.js");
const sendMailHelper = require("../../helpers/sendMail.js");

// [GET] /user/register
module.exports.register = async (req, res) => {
    res.render("client/pages/user/register.pug", {
        pageTitle: "Đăng ký"
    });
};


// [POST] /user/register
module.exports.registerPost = async (req, res) => {
    const emailExist = await User.findOne({
        email: req.body.email,
        deleted :false
    });
    if (emailExist) {
        req.flash("error",`Email ${req.body.email} đã tồn tại!`);
        res.redirect("back");
        return;
    }
    req.body.password = md5(req.body.password);
    const user = new User(req.body);
    await user.save();
    res.redirect(`/`);
};

// [GET] /user/login
module.exports.login = async (req, res) => {
    res.render("client/pages/user/login.pug", {
        pageTitle: "Đăng nhập"
    });
};



// [POST] /user/login
module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({
        email: email,
        deleted :false
    });
    if (!user) {
        req.flash("error",`Email ${req.body.email} không tồn tại!`);
        res.redirect("back");
        return;
    }
    if (md5(password) !== user.password){
        req.flash("error",`Mật khẩu không đúng!`);
        res.redirect("back");
        return;
    }
    if(user.status == "inactive"){
        req.flash("error", "Tài khoản đã bị khóa!");
        res.redirect("back");
        return;
    }
    const cart = await Cart.findOne({
        user_id : user.id
    });
    if (cart){
        if(req.cookies.cartId != cart.id){
            await Cart.deleteOne({_id: req.cookies.cartId});
            res.cookie('cartId', cart._id, {
                expires: new Date(Date.now() + 1000*60*60*24*365),
            });
        }
    } else {
        await Cart.updateOne({
            _id: req.cookies.cartId
        },{
            user_id : user.id
        });
    };
    res.cookie("tokenUser", user.tokenUser);
    await User.updateOne({
        tokenUser: user.tokenUser
    },{
        statusOnline: "online"
    });

    _io.once('connection', (socket) => {
        socket.broadcast.emit("SERVER_RETURN_USER_STATUS_ONLINE", {
            userId: user.id,
            status:"online"
        });
    });
    res.redirect(`/`);
};


// [GET] /user/logout
module.exports.logout = async (req, res) => {
    await User.updateOne({
        tokenUser: req.cookies.tokenUser
    },{
        statusOnline: "offline"
    });

    _io.once('connection', (socket) => {
        socket.broadcast.emit("SERVER_RETURN_USER_STATUS_ONLINE", {
            userId: res.locals.user.id,
            status:"offline"
        });
    });
    res.clearCookie("tokenUser");
    res.clearCookie("cartId");
    res.redirect("/");
};


// [GET] /user/forgot
module.exports.forgotPassword = async (req, res) => {
    res.render("client/pages/user/forgot-password.pug", {
        pageTitle: "Lấy lại mật khẩu!"
    });
};

// [POST] /user/forgot
module.exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email;
    const user = await User.findOne({
        email: email,
        deleted: false
    });

    if(!user){
        req.flash("error",`Email không tồn tại!`);
        res.redirect("back");
        return;
    };

    //Lưu thông tin vào DB
    const otp = generateHelper.generateRandomNumber(8);
    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: new Date(Date.now() + 180 * 1000)
    };
    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();
    
    const subject = "Mã OTP đổi mật khẩu!";
    const html = `
        Mã OTP để lấy lại mật khẩu là <b>${otp}</b>. Thời hạn sử dụng là 3 phút!"
    `;
    //Tồn tại email và xử lý]
    sendMailHelper.sendMail(email,subject,html);
    res.redirect(`/user/password/otp?email=${email}`);
};

// [GET] /user/password/otp
module.exports.otpPassword = async (req, res) => {
    const email = req.query.email;
    res.render("client/pages/user/otp-password",{
        pageTitle: "Nhập mã OTP",
        email: email
    });
};

// [POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;
    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    });
    if (!result){
        req.flash("error",`OTP Không hợp lệ!`);
        res.redirect("back");
        return;
    }
    const user = await User.findOne({
        email: email
    });
    res.cookie("tokenUser",user.tokenUser);
    res.redirect(`/user/password/reset`);
};

// [GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
    res.render("client/pages/user/reset-password",{
        pageTitle: "Đổi mật khẩu"
    });
};

// [Post] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
    const password = req.body.password;
    const tokenUser = req.cookies.tokenUser;

    await User.updateOne({
        tokenUser: tokenUser
    },{
        password: md5(password)
    });


    req.flash("success",`Đổi mật khẩu thành công!`);
    res.redirect("/");
};

// [GET] /user/info
module.exports.info = async (req, res) => {
    res.render("client/pages/user/info",{
        pageTitle: "Thông tin cá nhân"
    });
};