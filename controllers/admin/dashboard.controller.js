const Product = require("../../models/product.model");
const CategoryProduct = require("../../models/products-category.model");
const Account = require("../../models/account.model");
const User = require("../../models/user.model");

// [GET] /admin/dashboard
module.exports.dashboard = async (req, res) => {
    const statistic = {
        categoryProuct:{
            total: 0,
            active: 0,
            inactive: 0,
        },
        product:{
            total: 0,
            active: 0,
            inactive: 0,
        },
        account:{
            total: 0,
            active: 0,
            inactive: 0,
        },
        user:{
            total: 0,
            active: 0,
            inactive: 0,
        },
    };
    statistic.categoryProuct.total = await CategoryProduct.countDocuments({deleted:false});
    statistic.categoryProuct.active = await CategoryProduct.countDocuments({deleted:false, status:"active"});
    statistic.categoryProuct.inactive = await CategoryProduct.countDocuments({deleted:false, status:"inactive"});

    statistic.product.total = await Product.countDocuments({deleted:false});
    statistic.product.active = await Product.countDocuments({deleted:false, status:"active"});
    statistic.product.inactive = await Product.countDocuments({deleted:false, status:"inactive"});
    
    statistic.account.total = await Account.countDocuments({deleted:false});
    statistic.account.active = await Account.countDocuments({deleted:false, status:"active"});
    statistic.account.inactive = await Account.countDocuments({deleted:false, status:"inactive"});

    statistic.user.total = await User.countDocuments({deleted:false});
    statistic.user.active = await User.countDocuments({deleted:false, status:"active"});
    statistic.user.inactive = await User.countDocuments({deleted:false, status:"inactive"});


    res.render("admin/pages/dashboard/index.pug",{
        pageTitle: "Dashboard",
        statistic: statistic
    });
}