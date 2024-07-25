const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController= require("../controllers/user");

router.get("/signup", userController.signupForm);

router.post("/signup", wrapAsync(userController.signup));

router.get("/login",userController.loginForm);

router.post('/login', saveRedirectUrl,
    passport.authenticate('local', 
        { failureRedirect: '/login', failureFlash: true }),
        userController.login 
);
router.get("/email",userController.email);
router.post("/forget",userController.forget);
router.get("/reset-password", userController.reset);
router.post("/reset-password", userController.postreset);

router.get("/logout",userController.logout);
module.exports= router;