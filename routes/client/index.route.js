const productRoutes = require("./product.route")
const homeRoutes = require("./home.route")
const searchRoutes = require("./search.route")
const cartRoutes = require("./cart.route")
const checkoutRoutes = require("./checkout.route")
const userRoutes = require("./user.route")
const chatRoutes = require("./chat.route.js");
const categoryMiddleware = require("../../middlewares/client/category.middleware.js")
const cartMiddleware = require("../../middlewares/client/cart.middleware.js")
const userMiddleware = require("../../middlewares/client/user.middleware.js")
const settingGeneralMiddleware = require("../../middlewares/client/settingGeneral.middleware");
const authenMiddleware = require("../../middlewares/client/auth.middleware.js");

module.exports = (app) => {
    app.use(categoryMiddleware.category);

    app.use(cartMiddleware.cartId);

    app.use(userMiddleware.infoUser);

    app.use(settingGeneralMiddleware.settingGeneral);

    app.use('/', homeRoutes);

    app.use('/products', productRoutes);

    app.use('/search', searchRoutes);

    app.use('/cart', cartRoutes);

    app.use('/checkout', checkoutRoutes);

    app.use('/user', userRoutes);

    app.use('/chat', authenMiddleware.requireAuth, chatRoutes)
}