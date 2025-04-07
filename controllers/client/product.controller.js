const Product = require("../../models/product.model.js");
const productHelper = require("../../helpers/products.js");
const ProductCategory = require("../../models/products-category.model.js");
const productCategoryHelper = require("../../helpers/products-category.js");
// [GET] /products
module.exports.index = async (req, res) => {
    const find = {
        status: "active",
        deleted: false
    };
    const newProducts = await Product.find(find).sort({
        position: 'desc'
    });
    const products = productHelper.priceNewProduct(newProducts);
    res.render("client/pages/products/index.pug", {
        pageTitle: "Products",
        products: products
    });
};

// [GET] /products/:slug
module.exports.detail = async (req, res) => {
    const slug = req.params.slug;
    const product = await Product.findOne({
        slug: slug,
        deleted: false,
        status: "active"
    });

    if(product.product_category_id) {
        const category = await ProductCategory.findOne({
            _id: product.product_category_id,
            status: "active",
            deleted: false
        });
        product.category = category;
    }
    productHelper.priceProduct(product);
    res.render("client/pages/products/detail.pug", {
        pageTitle: "DetailProduct",
        product: product
    });
};


// [GET] /products/:slugCategory
module.exports.productCategory = async (req, res) => {
    const slugCategory = req.params.slugCategory;
    const category = await ProductCategory.findOne({
        slug: slugCategory,
        deleted: false
    });

    const listSubCategoryId = await productCategoryHelper.getSubCategory(category.id);

    const newProducts = await Product.find({
        product_category_id: {$in: [category.id,...listSubCategoryId]},
        deleted: false
    }).sort({
        position: 'desc'
    });

    const products = productHelper.priceNewProduct(newProducts);

    res.render("client/pages/products/index.pug", {
        pageTitle: category.title,
        products: products
    });
};