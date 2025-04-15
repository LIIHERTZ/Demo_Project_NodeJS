const Product = require("../../models/product.model.js");
const Cart = require("../../models/cart.model.js");
const Order = require("../../models/order.model.js");
const productHelper = require("../../helpers/products.js");


// [GET] /checkout/
module.exports.index = async (req, res) => {
    const cartId = req.cookies.cartId;
    const cart = await Cart.findOne({
        _id: cartId
    });

    if (cart.product.length > 0) {
        for (const item of cart.product) {
            const productId = item.product_id;
            const productInfo = await Product.findOne({
                _id: productId,
            }).select("title thumbnail slug price discountPercentage");
            productInfo.priceNew = productHelper.priceProduct(productInfo);
            item.productInfo = productInfo;
            item.totalPrice = productInfo.priceNew * item.quantity;
        }
    }
    cart.totalPrice = cart.product.reduce((sum, item) => sum + item.totalPrice, 0);
    res.render("client/pages/checkout/index.pug", {
        pageTitle: "Thanh toán",
        cartDetail: cart
    });
};


//[POST] /checkout/order
module.exports.order = async (req, res) => {
    const cartId = req.cookies.cartId;
    const userInfo = req.body;
    const cart = await Cart.findOne({
        _id: cartId
    });
    const products = [];
    for (const product of cart.product) {
        const objectProduct = {
            product_id: product.product_id,
            price: 0,
            discountPercentage: 0,
            quantity: product.quantity
        };
        const productInfo = await Product.findOne({
            _id: product.product_id
        }).select("price discountPercentage");

        objectProduct.price = productInfo.price;
        objectProduct.discountPercentage = productInfo.discountPercentage;
        objectProduct.priceNew = productHelper.priceProduct(productInfo);
        products.push(objectProduct);
    };
    const orderInfo = {
        cart_id: cartId,
        userInfo: userInfo,
        products: products
    };
    const order = new Order(orderInfo);
    order.save();

    await Cart.updateOne(
        {
            _id: cartId
        },
        {
            product:[]
        }
    );
    res.redirect(`/checkout/success/${order.id}`); 
};

// [GET] /checkout/success/:orderId
module.exports.success = async (req, res) => {
    const order = await Order.findOne({
        _id :req.params.orderId 
    });
    for (const product of order.products){
        const productInfo = await Product.findOne({
            _id: product.product_id
        }).select("title thumbnail");
        product.productInfo = productInfo;
        product.priceNew = productHelper.priceProduct(product);
        product.totalPrice = product.priceNew * product.quantity;
    };
    order.totalPrice = order.products.reduce((sum, item) => sum + item.totalPrice, 0);
    res.render("client/pages/checkout/success.pug", {
        pageTitle: "Thanh toán",
        order : order
    });
};