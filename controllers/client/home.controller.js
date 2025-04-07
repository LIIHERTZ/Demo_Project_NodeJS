const Product = require("../../models/product.model");
const productHelper = require("../../helpers/products.js");


// [GET] /
module.exports.index = async (req, res) => {   
    // Danh sách sản phẩm nổi bật
    const products = await Product.find({
        featured: true,
        status: "active",
        deleted: false 
    }).limit(6);
    productFeatured = productHelper.priceNewProduct(products);

    // Danh sách sản phẩm mới
    const productsNew = await Product.find({
        status: "active",
        deleted: false 
    }).sort({position:"desc"}).limit(6);

    productNew = productHelper.priceNewProduct(productsNew);

    res.render("client/pages/home/index.pug",{
        pageTitle: "Home",
        productFeatured: productFeatured,
        productNew: productNew
    });
}