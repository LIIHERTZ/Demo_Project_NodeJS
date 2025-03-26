const Account = require("../../models/account.model");
const Role = require("../../models/roles.model");
const systemConfig = require("../../config/system.js");
const md5 = require("md5");

// [GET] /admin/accounts/
module.exports.index = async (req, res) => {
    let find ={
        deleted : false
    };

    const records = await Account.find(find).select("-password -token");

    for (const record of records) {
        const role = await Role.findOne({
            _id: record.role_id,
            deleted : false
        });
        record.role = role;
    };

    res.render("admin/pages/accounts/index.pug",{
        pageTitle: "Tài khoản",
        records: records
    });
}

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
    const find = {
        deleted : false
    };
    const roles = await Role.find(find);
    res.render("admin/pages/accounts/create.pug",{
        pageTitle: "Tạo tài khoản",
        roles: roles
    });
}

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
    const emailExist = await Account.findOne({
        email: req.body.email,
        deleted :false
    });
    if (emailExist) {
        req.flash("error",`Email ${req.body.email} đã tồn tại!`);
        res.redirect("back");
    }else{
        req.body.password = md5(req.body.password);
        const record = new Account(req.body);
        await record.save();
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
}

//[GET] /edit/:id
module.exports.edit = async (req, res) =>{
    try{
        const find = {
            deleted: false,
            _id: req.params.id
        };
        const record = await Account.findOne(find);
        const roles = await Role.find({deleted:false});
        res.render("admin/pages/accounts/edit.pug",{
            pageTitle: "EditAccount",
            roles: roles,
            record: record
        });

    }
    catch(error){
        req.flash("error", "Không tồn tại tài khoản!");
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }

};


//[PATCH] /edit/:id
module.exports.editPatch = async (req, res) =>{
    const id = req.params.id;
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
};  
