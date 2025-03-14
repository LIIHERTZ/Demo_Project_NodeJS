const Product = require("../../models/product.model.js");

const filterStatusHelper = require("../../helpers/filterStatus.js");
const searchHelper = require("../../helpers/search.js");
const paginationHelper = require("../../helpers/pagination.js");


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

    const products = await Product.find(find).limit(objectPagination.limitItems).skip( objectPagination.skip);
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
    const status = req.params.status;
    const id = req.params.id;
    await Product.updateOne ({_id: id}, {status: status});
    res.redirect("back");
};


// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const ids = req.body.ids.split(", ");
    const type = req.body.type;

    switch (type){
        case "active":
            await Product.updateMany({_id: {$in: ids}}, {status: "active"});
            break;
        case "inactive":
            await Product.updateMany({_id: {$in: ids}}, {status: "inactive"});
            break;
        default:
            break;
    }
    res.redirect("back");
};