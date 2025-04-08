const Product = require("../../models/product.model.js");
const Cart = require("../../models/cart.model.js");
const productHelper = require("../../helpers/products.js");


// [GET] /cart/
module.exports.index = async (req,res) => {
    const cartId = req.cookies.cartId;
    const cart = await Cart.findOne({
        _id: cartId
    });

    if (cart.product.length > 0){
        for (const item of cart.product){
            const productId = item.product_id;
            const productInfo = await Product.findOne({
                _id: productId,
            }).select("title thumbnail slug price discountPercentage");
            productInfo.priceNew = productHelper.priceProduct(productInfo);
            item.productInfo = productInfo;
            item.totalPrice = productInfo.priceNew * item.quantity;
        }
    }
    cart.totalPrice = cart.product.reduce((sum, item)=>sum + item.totalPrice,0);
    res.render("client/pages/cart/index.pug",{
        pageTitle: "Giỏ hàng",
        cartDetail: cart
    });
};

// [POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity);
    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({_id: cartId})

    const existingProduct = cart.product.find(item => item.product_id == productId);
    if (existingProduct){
        const quantityNew = quantity + existingProduct.quantity;
        await Cart.updateOne({
            _id: cartId,
            "product.product_id": productId
        },{
            $set:{
                "product.$.quantity": quantityNew
            }
        });
    }else{
        const objectCart = {
            product_id: productId,
            quantity: quantity
        };
        await Cart.updateOne(
            { 
                _id: cartId 
            },
            { 
                $push: { product: objectCart } 
            }
        );
    }


    req.flash("success", "Thêm sản phẩm vào giỏ hàng thành công!");
    res.redirect("back");
};

//[GET] /cart/delete/:productId
module.exports.delete = async (req, res) => {
    const productId = req.params.productId;
    const cartId = req.cookies.cartId;
    await Cart.updateOne(
        { 
            _id: cartId 
        },
        { 
            $pull: { product: {product_id: productId} } 
        }
    );
    req.flash("success",`Xóa thành công!`);
    res.redirect("back");           
};

//[GET] /cart/update/:productId/:quantity
module.exports.update = async (req, res) => {
    const productId = req.params.productId;
    const quantity = req.params.quantity;
    const cartId = req.cookies.cartId;
    await Cart.updateOne({
        _id: cartId,
        "product.product_id": productId
    },{
        $set:{
            "product.$.quantity": quantity
        }
    });
    req.flash("success",`Update thành công!`);
    res.redirect("back");           
};