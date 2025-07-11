const Cart = require('../../models/cart.model');
const User = require("../../models/user.model");

module.exports.cartId = async (req, res, next) => {
    if (!req.cookies.cartId) {
        //Tạo giỏ hàng
        const expriresCookie = 1000*60*60*24*365;
        const cart = new Cart();
        await cart.save();
        res.cookie('cartId', cart._id, {
            expires: new Date(Date.now() + expriresCookie),
        });
    }else{
        //Lấy ra
        const cart = await Cart.findOne({
            _id: req.cookies.cartId
        });
        if (req.cookies.tokenUser){
            const user = await User.findOne({tokenUser:req.cookies.tokenUser});
            if (user && !cart.user_id) {
                await cart.updateOne({ user_id: user.id });
            }
        };
        if(cart){
            const totalQuantity = cart.product.reduce((sum, item) => sum + item.quantity,0);
            cart.totalQuantity = totalQuantity;
            res.locals.miniCart = cart;
        }
        else{
            const expriresCookie = 1000*60*60*24*365;
            const cart = new Cart();
            await cart.save();
            res.cookie('cartId', cart._id, {
                expires: new Date(Date.now() + expriresCookie),
            });
        };
    }
    next();
}