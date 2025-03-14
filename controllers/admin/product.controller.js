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

module.exports.edit = (req, res) => {
    res.render("admin/pages/products/index.pug");
};