const Product = require("../../models/product.model.js");
// [GET] /products
module.exports.index = async (req, res) => {
    const find = {
        status: "active",
        deleted : false
    };
    const products = await Product.find(find).sort({position: 'desc'});
    products.forEach(item =>{
        item.priceNew = Math.ceil(item.price * (100 - item.discountPercentage)/100);
    });
    res.render("client/pages/products/index.pug",{
        pageTitle: "Products",
        products: products
    });
};

// [GET] /products/:slug
module.exports.detail = async (req, res) => {
    const slug = req.params.slug;
    const product = await Product.findOne({slug: slug});
    res.render("client/pages/products/detail.pug",{
        pageTitle: "DetailProduct",
        product: product
    });
};