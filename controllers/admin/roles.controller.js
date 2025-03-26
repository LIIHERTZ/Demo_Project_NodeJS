const Role = require("../../models/roles.model");
const systemConfig = require("../../config/system.js");

// [GET] /admin/roles/
module.exports.index = async (req, res) => {
    let find ={
        deleted : false
    };

    const records = await Role.find(find);

    res.render("admin/pages/roles/index.pug",{
        pageTitle: "Phân quyền",
        records: records
    });
}


// [GET] /admin/roles/create
module.exports.create = async (req, res) => {


    res.render("admin/pages/roles/create.pug",{
        pageTitle: "Tạo phân quyền"
    });
}


// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
    const record = new Role(req.body);
    await record.save();
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
}

// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    try{
        const find ={
            _id :req.params.id,
            deleted : false
        };
        const data = await Role.findOne(find);
    
        res.render("admin/pages/roles/edit.pug",{
            pageTitle: "Chỉnh sửa phân quyền",
            data: data
        });
    }catch(e){
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
}

// [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
    try{
        const record = await Role.updateOne({_id:req.params.id}, req.body);
        req.flash("success", "Update thành công!");
        res.redirect("back");
    }catch(e){
        req.flash("error", "Lỗi update!");
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
}

//[DELETE] /admin/roles/delete/:id
module.exports.delete = async (req, res) => {
    const id = req.params.id;
    await Role.updateOne({_id: id}, {
        deleted: true,
        deletedAt: new Date()
    });
    req.flash("success",`Xóa thành công!`);
    res.redirect("back");           
};

//[GET] /detail/:id
module.exports.detail = async(req, res) =>{
    try{
        const find = {
            deleted: false,
            _id: req.params.id
        };
        const record = await Role.findOne(find);
        res.render("admin/pages/roles/detail.pug",{
            pageTitle: record.title,
            record : record
        });

    }
    catch(error){
        req.flash("error", "Không tồn tại quyền!");
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
};

//[GET] /permissions
module.exports.permissions = async(req, res) =>{
    try{
        const find = {
            deleted: false,
        };
        const records = await Role.find(find);
        res.render("admin/pages/roles/permissions.pug",{
            pageTitle: "Phân quyền",
            records : records
        });

    }
    catch(error){
        req.flash("error", "Không tồn tại quyền!");
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
};


//[PATCH] /permissions
module.exports.permissionsPatch = async(req, res) =>{
    try{
        const permissions = JSON.parse(req.body.permissions);
        for(const item of permissions){
            await Role.updateOne({_id: item.id},{permissions: item.permissions});
        }
        req.flash("success", "Update quyền thành công!");
        res.redirect("back");
    }catch(error){
        req.flash("error", "Lỗi update!");
        res.redirect(`${systemConfig.prefixAdmin}/roles/permissions`);
    }
}