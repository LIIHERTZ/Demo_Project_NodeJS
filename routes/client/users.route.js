const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/users.controller.js");
const validate = require("../../validates/client/user.validate.js");
const authMiddleWare = require("../../middlewares/client/auth.middleware.js");

router.get('/not-friend', controller.notFriend);

router.get('/request', controller.request);

router.get('/accept', controller.accept);

router.get('/friends', controller.friends);

module.exports = router;