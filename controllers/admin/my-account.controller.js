const systemConfig = require("../../config/system.js");
const Account = require("../../models/account.model.js");
const md5 = require("md5");

// [GET] /admin/my-account/
module.exports.index = async (req, res) => {
    let find ={
        deleted : false
    };

    res.render("admin/pages/my-account/index.pug",{
        pageTitle: "Tài khoản"
    });
}


// [GET] /admin/my-account/edit/:id
module.exports.edit = async (req, res) => {
    res.render("admin/pages/my-account/edit.pug",{
        pageTitle: "Chỉnh sửa"
    });
}

// [PATCH] /admin/my-account/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = res.locals.user.id;
    if (req.body.password){
        req.body.password = md5(req.body.password);
    }else{
        delete req.body.password;
    };
    const emailExist = await Account.findOne({
        _id:{$ne:id},
        email: req.body.email,
        deleted :false
    });
    if (emailExist) {
        req.flash("error",`Email ${req.body.email} đã tồn tại!`);
        res.redirect("back");
    }else{
        try{
            await Account.updateOne({_id: id},req.body);
            req.flash("success", "Update thành công!");
            res.redirect("back");
        }
        catch(error){
            req.flash("error", "Lỗi update!");
            res.redirect(`${systemConfig.prefixAdmin}/accounts`);
        }
    }
}