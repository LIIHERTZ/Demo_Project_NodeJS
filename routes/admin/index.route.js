const systemConfig = require("../../config/system.js")

const dashboardRoutes = require("./dashboard.route")
const productsdRoutes = require("./product.route")

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;
    app.use(PATH_ADMIN + '/dashboard', dashboardRoutes);
    app.use(PATH_ADMIN + '/products', productsdRoutes);
}