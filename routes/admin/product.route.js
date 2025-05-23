const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/product.controller.js");
const multer = require('multer');
//const storageMulter = require('../../helpers/storageMulter.js');
const upload = multer();
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware.js');
const validate = require('../../validates/admin/product.validate.js');

router.get('/', controller.index);

router.patch('/change-Status/:status/:id', controller.changeStatus);

router.patch('/change-multi', controller.changeMulti);

router.delete('/delete/:id', controller.deleteItem);

router.get('/create', controller.create);

router.post('/create', upload.single("thumbnail"), uploadCloud.upload ,validate.createPost ,controller.createPost);

router.get('/edit/:id', controller.edit);

router.patch('/edit/:id', upload.single("thumbnail"),  uploadCloud.upload ,validate.createPost ,controller.editPatch);

router.get('/detail/:id', controller.detail);

module.exports = router