const express = require("express");
const router = express.Router();
const userCtrl = require("../controller/user.controller");
const authCtrl = require("../middleware/auth");

router.route("/").get(authCtrl, userCtrl.getUserId); // default route to get user id
router.route("/auth").post(userCtrl.isTokenValid); // route to check user token validation
router.route("/register").post(userCtrl.userRegistration); // route to create new user
router.route("/login").post(userCtrl.userLogin); // route to give access to existing user

module.exports = router;
