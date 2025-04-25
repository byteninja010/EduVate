const mongoose=require("mongoose");
require('dotenv').config();
const mailSender=require("../utils/sendVerificationEmail");
const otpTemplate=require("../mailTemplates/otpTemplate");
const otpSchema=new mongoose.Schema({
  email:{
    type:String,
    required:true,
  },
  otp:{
    type:String,
    required:true,

  },
  createdAt:{
    type:Date,
    default:Date.now(),
    expires:5*60,
  }
});


//A function to send emails before just creating entry in the db

const sendVerificationEmail=async(email,otp)=>{
  try{
    const mailresponse=await mailSender(email,"Verification Email from EduVate",otpTemplate(otp));
    console.log("Email Send Succesfully");
  }catch(err){
    console.log("Error in mail sending");
     console.log(err);
  }
}

//this only works with function keyword
otpSchema.pre("save", async function (next) { // Use function keyword here
  console.log("Email:", this.email);
  console.log("OTP:", this.otp);
  await sendVerificationEmail(this.email, this.otp);
  next();
})
3
const otpModel=mongoose.model("otpModel",otpSchema);
module.exports=otpModel;
