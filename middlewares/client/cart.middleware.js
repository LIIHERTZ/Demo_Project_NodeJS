const Cart = require('../../models/cart.model');

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
        const totalQuantity = cart.product.reduce((sum, item) => sum + item.quantity,0);
        cart.totalQuantity = totalQuantity;
        res.locals.miniCart = cart;
    }
    next();
}