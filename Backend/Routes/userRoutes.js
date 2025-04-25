const express=require("express");
const router=express.Router();

const {login,signUp,sendOtp,changePassword}=require("../Controllers/Auth");

const{resetPassword,resetPasswordToken}=require("../Controllers/ResetPassword");

const {auth}=require("../middlewares/auth");

// Route for user login
router.post("/login", login);

// Route for user signup
router.post("/signup", signUp);

// Route for sending OTP to the user's email
router.post("/sendotp", sendOtp);

// Route for Changing the password
router.post("/changepassword", auth, changePassword);


// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken);

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword);

// Export the router for use in the main application
module.exports = router;