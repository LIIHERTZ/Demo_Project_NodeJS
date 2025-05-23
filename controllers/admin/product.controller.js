const Product = require("../../models/product.model.js");
const ProductCategory = require("../../models/products-category.model.js");
const Account = require("../../models/account.model.js");

const systemConfig = require("../../config/system.js");

const filterStatusHelper = require("../../helpers/filterStatus.js");
const searchHelper = require("../../helpers/search.js");
const paginationHelper = require("../../helpers/pagination.js");
const createTreeHelper = require("../../helpers/createTree.js");


// [GET] /admin/products
module.exports.index = async (req, res) => {
    // Đoạn bộ lọc
    const filterStatus = filterStatusHelper(req.query);
    // Đoạn tìm kiếm
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
    const countProducts = await Product.countDocuments(find);
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
    const products = await Product.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip( objectPagination.skip);
    for (const product of products){
        // Lấy người tạo sản phẩm
        const user = await Account.findOne({
            _id: product.createdBy.account_id
        });
        if (user){
            product.accountFullname = user.fullName;
        }
        //Lấy người thay đổi sản phẩm
        const updateBy = product.updateBy.slice(-1)[0];
        if (updateBy){
            const userUpdate = await Account.findOne({
                _id: updateBy.account_id       
            });
            if (userUpdate){
                updateBy.accountFullname = userUpdate.fullName;
            }
        }
    }
    res.render("admin/pages/products/index.pug",{
        pageTitle: "Products",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
};

//[PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const updated ={
        account_id : res.locals.user.id,
        updateAt: new Date
    };
    const status = req.params.status;
    const id = req.params.id;
    await Product.updateOne ({_id: id}, {
        status: status,
        $push:{
            updateBy: updated
        }
    });
    req.flash("success","Cập nhập trạng thái thành công!");
    res.redirect("back");
};

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const ids = req.body.ids.split(", ");
    const type = req.body.type;

    const updated ={
        account_id : res.locals.user.id,
        updateAt: new Date
    };

    switch (type){
        case "active":
            await Product.updateMany({_id: {$in: ids}}, {
                status: "active",
                $push:{
                    updateBy: updated
                }
            });
            req.flash("success",`Cập nhập trạng thái thành công ${ids.length} sản phẩm!`);
            break;
        case "inactive":
            await Product.updateMany({_id: {$in: ids}}, {
                status: "inactive",
                $push:{
                    updateBy: updated
                }
            });
            req.flash("success",`Cập nhập trạng thái thành công ${ids.length} sản phẩm!`);
            break;
        case "delete-all":
            await Product.updateMany({_id: {$in: ids}}, {
                deletedBy:{
                    account_id : res.locals.user.id,
                    deleteAt: new Date
                }
            });
            req.flash("success",`Xóa thành công ${ids.length} sản phẩm!`);
            break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);
                await Product.updateOne({_id: id}, {
                    position: position,
                    $push:{
                        updateBy: updated
                    }
                });
            }
            req.flash("success",`Thay đổi vị trí thành công ${ids.length} sản phẩm!`);
            break;
        default:
            break;
    }
    res.redirect("back");
};

//[DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    await Product.updateOne({_id: id}, {
        deletedBy:{
            account_id : res.locals.user.id,
            deleteAt: new Date
        }

    });
    req.flash("success",`Xóa thành công!`);
    //await Product.deleteOne({_id: id});
    res.redirect("back");           
};

//[GET] /admin/products/create
module.exports.create = async (req, res) => {
    const find = {
        deleted : false
    };

    const records = await ProductCategory.find(find);

    const newRecords = createTreeHelper(records);
    res.render("admin/pages/products/create.pug",{
        pageTitle: "CreareProduct",
        records: newRecords
    });
};

//[POST] /admin/products/create
module.exports.createPost = async (req, res) => {
    if (!req.body.title){
        req.flash("error", "Vui lòng nhập tiêu đề!");
        res.redirect("back"); 
        return;
    }
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    if(req.body.position =="") {
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;
    } else{
        req.body.position = parseInt(req.body.position);
    }
    req.body.createdBy = {
        account_id : res.locals.user.id
    };
    const product = new Product(req.body);
    await product.save();

    res.redirect(`${systemConfig.prefixAdmin}/products`);
};

//[GET] /edit/:id
module.exports.edit = async (req, res) =>{
    try{
        const find = {
            deleted: false,
            _id: req.params.id
        };
        const records = await ProductCategory.find({deleted: false});
        const newRecords = createTreeHelper(records);
        const product = await Product.findOne(find);
        res.render("admin/pages/products/edit.pug",{
            pageTitle: "EditProduct",
            product: product,
            records: newRecords
        });

    }
    catch(error){
        req.flash("error", "Không tồn tại sản phẩm!");
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }

};

//[PATCH] /edit/:id
module.exports.editPatch = async (req, res) =>{
    const id = req.params.id;
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);

    try{
        const updated ={
            account_id : res.locals.user.id,
            updateAt: new Date
        };
        await Product.updateOne({_id: id},{
            ...req.body,
            $push:{updateBy: updated}
        });
        req.flash("success", "Update thành công!");
        res.redirect("back");
    }
    catch(error){
        req.flash("error", "Lỗi update!");
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};  

//[GET] /detail/:id
module.exports.detail = async(req, res) =>{
    try{
        const find = {
            deleted: false,
            _id: req.params.id
        };
        const product = await Product.findOne(find);
        let parentRecord =null;
        if(product.product_category_id){
            parentRecord = await ProductCategory.findOne({_id: product.product_category_id,  deleted: false});
        };
        res.render("admin/pages/products/detail.pug",{
            pageTitle: product.title,
            product : product,
            category: parentRecord
        });

    }
    catch(error){
        req.flash("error", "Không tồn tại sản phẩm!");
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};