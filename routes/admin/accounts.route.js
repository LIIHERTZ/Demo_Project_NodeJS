const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/accounts.controller.js");
const multer = require('multer');
const upload = multer();
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware.js');
const validate = require('../../validates/admin/account.validate.js');

router.get('/', controller.index);

router.get('/create', controller.create);

router.post('/create',upload.single("avatar"), uploadCloud.upload, validate.createPost, controller.createPost);

router.get('/edit/:id', controller.edit);

router.patch('/edit/:id', upload.single("avatar"), uploadCloud.upload, validate.editPacth, controller.editPatch);

// router.delete('/delete/:id', controller.delete);

// router.get('/detail/:id', controller.detail);

// router.get('/permissions', controller.permissions);

// router.patch('/permissions', controller.permissionsPatch);

module.exports = router