const uploadCloud = require("../../helpers/upload-cloudinary");
module.exports.upload = async (req, res, next) => {
    if(req.file){
        req.body[req.file.fieldname] = await uploadCloud(req.file.buffer);
    };
    next();
};