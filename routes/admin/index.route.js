const systemConfig = require("../../config/system.js")
const authmiddleware = require("../../middlewares/admin/auth.middleware.js");
const dashboardRoutes = require("./dashboard.route")
const productsRoutes = require("./product.route")
const productsCategoryRoutes = require("./products-category.route")
const rolesRoutes = require("./roles.route")
const accountsRoutes = require("./accounts.route")
const myAccountsRoutes = require("./my-account.route")
const settingsRoutes = require("./setting.route")
const authRoutes = require("./auth.route")

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;
    app.use(PATH_ADMIN + '/dashboard', authmiddleware.requireAuth, dashboardRoutes);
    app.use(PATH_ADMIN + '/products', authmiddleware.requireAuth, productsRoutes);
    app.use(PATH_ADMIN + '/products-category', authmiddleware.requireAuth, productsCategoryRoutes);
    app.use(PATH_ADMIN + '/roles', authmiddleware.requireAuth, rolesRoutes);
    app.use(PATH_ADMIN + '/accounts', authmiddleware.requireAuth, accountsRoutes);
    app.use(PATH_ADMIN + '/my-account', authmiddleware.requireAuth, myAccountsRoutes);
    app.use(PATH_ADMIN + '/settings', authmiddleware.requireAuth, settingsRoutes);
    app.use(PATH_ADMIN + '/auth', authRoutes);
    
} 