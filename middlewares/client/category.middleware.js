const ProductCategory = require("../../models/products-category.model.js");
const createTreeHelper = require("../../helpers/createTree.js");
module.exports.category = async (req, res, next) => {
    let find = {
            deleted : false
        };
    const records = await ProductCategory.find(find);
    const newRecords = createTreeHelper(records);   
    res.locals.layoutProductCategory = newRecords;
    next();
}