const express = require('express');
const usersController = require('../controllers/users.controller');
const authMiddleware = require('../middlewares/auth');
const upload  = require("../middlewares/uploadImg")

const router = express.Router();

router.route("/").get(authMiddleware,usersController.getAllUsers)
router.route("/register").post(upload.single("avatar"),usersController.register)
router.route("/login").post(usersController.login)

module.exports = router;