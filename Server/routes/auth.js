const express = require("express");
const router = express.Router();
const passport = require("passport");
const passportConfig = require("../passport/passport");

const AuthController = require("../controllers/auth");
const passportSignIn = passport.authenticate("local", { session: false });

router.route("/signup").post(AuthController.signUp);

router.route("/signin").post(passportSignIn, AuthController.signIn);

module.exports = router;
