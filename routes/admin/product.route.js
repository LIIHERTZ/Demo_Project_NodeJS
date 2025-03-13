const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/product.controller.js");

router.get('/', controller.index);

router.get('/edit', controller.edit);

module.exports = router