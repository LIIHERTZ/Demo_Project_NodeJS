const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema({
    user_id: {
        type: String,
        default: null
    },
    product: [{
        product_id: String,
        quantity: Number,
    }, ],
}, {
    timestamps: true,
});

const Cart = mongoose.model("Cart", cartSchema, "carts");
module.exports = Cart;