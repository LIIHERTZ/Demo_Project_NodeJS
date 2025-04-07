const Product = require("../../models/product.model.js");
const searchHelper = require("../../helpers/search.js");
const productHelper = require("../../helpers/products.js");

// [GET] /search
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
        status: "active"
    };
    const objectSearch = searchHelper(req.query);
    if (objectSearch.regex){
        find.title = objectSearch.regex;
    }

    const product = await Product.find(find);
    const products = productHelper.priceNewProduct(product);
    res.render("client/pages/search/index.pug", {
        pageTitle: "Tìm kiếm",
        keyword: objectSearch.keyword,
        products: products,
    });
};