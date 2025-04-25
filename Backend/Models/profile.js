const mongoose=require("mongoose");
const profileSchema=new mongoose.Schema({
   gender:{
    type:String,
   },
   dob:{
    type:Date,
   },
   about:{
    type:String,
    trim:true,
   },
   contactNumber:{
    type:Number,
    trim:true,
   }

});

const profileModel=mongoose.model("profileModel",profileSchema);
module.exports=profileModel;
