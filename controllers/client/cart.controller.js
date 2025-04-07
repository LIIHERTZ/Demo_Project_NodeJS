const Product = require("../../models/product.model.js");
const Cart = require("../../models/cart.model.js");

// [GET] /search
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