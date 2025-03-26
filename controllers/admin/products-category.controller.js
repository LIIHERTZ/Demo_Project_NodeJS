const ProductCategory = require("../../models/products-category.model.js");
const systemConfig = require("../../config/system.js");
const filterStatusHelper = require("../../helpers/filterStatus.js");
const searchHelper = require("../../helpers/search.js");
const paginationHelper = require("../../helpers/pagination.js");
const createTreeHelper = require("../../helpers/createTree.js");


// [GET] /admin/products-category
module.exports.index = async (req, res) => {
    const filterStatus = filterStatusHelper(req.query);
    let find = {
            deleted : false
    };
    const objectSearch = searchHelper(req.query);
    if (objectSearch.regex){
        find.title = objectSearch.regex;
    }
    if (req.query.status){
        find.status = req.query.status;
    }

    //Pagination
    const countProducts = await ProductCategory.countDocuments(find);
    let objectPagination = paginationHelper (
        {
        currentPage: 1,
        limitItems : 4
        },
        req.query,
        countProducts
    );
    let sort = {};
    if (req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey] = req.query.sortValue;
    }else{
        sort.position = "desc";
    }

    const records = await ProductCategory.find(find);
    // .sort(sort)
    // .limit(objectPagination.limitItems)
    // .skip( objectPagination.skip);

    const newRecords = createTreeHelper(records);

    res.render("admin/pages/products-category/index.pug",{
        pageTitle: "Products Category",
        records: newRecords,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
};

//[PATCH] /admin/products-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    await ProductCategory.updateOne ({_id: id}, {status: status});
    req.flash("success","Cập nhập trạng thái thành công!");
    res.redirect("back");
};

// [PATCH] /admin/products-category/change-multi
module.exports.changeMulti = async (req, res) => {
    const ids = req.body.ids.split(", ");
    const type = req.body.type;

    switch (type){
        case "active":
            await ProductCategory.updateMany({_id: {$in: ids}}, {status: "active"});
            req.flash("success",`Cập nhập danh mục thành công ${ids.length} sản phẩm!`);
            break;
        case "inactive":
            await ProductCategory.updateMany({_id: {$in: ids}}, {status: "inactive"});
            req.flash("success",`Cập nhập danh mục thành công ${ids.length} sản phẩm!`);
            break;
        case "delete-all":
            await ProductCategory.updateMany({_id: {$in: ids}}, {
                deleted: true,
                deletedAt: new Date()
            });
            req.flash("success",`Xóa thành công ${ids.length} danh mục!`);
            break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);
                await ProductCategory.updateOne({_id: id}, {position: position});
            }
            req.flash("success",`Thay đổi vị trí thành công ${ids.length} danh mục!`);
            break;
        default:
            break;
    }
    res.redirect("back");
};

//[DELETE] /admin/products-category/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    await ProductCategory.updateOne({_id: id}, {
        deleted: true,
        deletedAt: new Date()
    });
    req.flash("success",`Xóa thành công!`);
    //await Product.deleteOne({_id: id});
    res.redirect("back");           
};

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
    const find = {
        deleted : false
    };

    const records = await ProductCategory.find(find);

    const newRecords = createTreeHelper(records);

    res.render("admin/pages/products-category/create.pug",{
        pageTitle: "Create Products Category",
        records: newRecords
    });
};

//[POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
    if(req.body.position =="") {
        const countProducts = await ProductCategory.countDocuments();
        req.body.position = countProducts + 1;
    } else{
        req.body.position = parseInt(req.body.position);
    }
    const record = new ProductCategory(req.body);
    await record.save();

    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
};

//[GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) =>{
    try{
        const find = {
            deleted: false,
            _id: req.params.id
        };
        const records = await ProductCategory.find({deleted: false});
        const newRecords = createTreeHelper(records);
        const productCategory = await ProductCategory.findOne(find);
        res.render("admin/pages/products-category/edit.pug",{
            pageTitle: "EditProductCategory",
            productCategory: productCategory,
            records: newRecords
        });

    }
    catch(error){
        req.flash("error", "Không tồn tại sản phẩm!");
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }

};

//[PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) =>{
    const id = req.params.id;
    req.body.position = parseInt(req.body.position);

    try{
        await ProductCategory.updateOne({_id: id},req.body);
        req.flash("success", "Update thành công!");
        res.redirect("back");
    }
    catch(error){
        req.flash("error", "Lỗi update!");
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
};  

//[GET] /admin/products-category/detail/:id
module.exports.detail = async(req, res) =>{
    try{
        const find = {
            deleted: false,
            _id: req.params.id
        };
        const record = await ProductCategory.findOne(find);
        let parentRecord = null;
        if (record.parent_id) {
            parentRecord = await ProductCategory.findOne({ _id: record.parent_id, deleted: false });
        }
        res.render("admin/pages/products-category/detail.pug",{
            pageTitle: record.title,
            record: record,
            parent: parentRecord
        });

    }
    catch(error){
        req.flash("error", "Không tồn tại sản phẩm!");
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
};