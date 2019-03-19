const express = require("express");
const router = express.Router();
const passport = require("passport");

const AuthController = require("../controllers/auth");
const passportJWT = passport.authenticate("jwt", { session: false });

router.route("/home").get(passportJWT, AuthController.loggedIn);

module.exports = router;
