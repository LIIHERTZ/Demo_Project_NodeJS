const Product = require("../../models/product.model.js");
// [GET] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({cuisine: 'Pizza'});
    res.render("client/pages/products/index.pug",{
        pageTitle: "Products",
        products: products
    });
};

module.exports.edit = (req, res) => {
    res.render("client/pages/products/index.pug");
};