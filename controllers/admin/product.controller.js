const Product = require("../../models/product.model.js");

const filterStatusHelper = require("../../helpers/filterStatus.js");
const searchHelper = require("../../helpers/search.js");


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
    const products = await Product.find(find);
    res.render("admin/pages/products/index.pug",{
        pageTitle: "Products",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword
    });
};

module.exports.edit = (req, res) => {
    res.render("admin/pages/products/index.pug");
};