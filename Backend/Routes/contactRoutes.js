const {contactUs}=require("../Controllers/miscellaneous")
const express=require("express");
const router=express.Router();

router.post("/contactUs",contactUs);

module.exports=router;