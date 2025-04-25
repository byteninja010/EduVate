const mongoose=require("mongoose");
const categorySchema=new mongoose.Schema({
   name:{
    type:String,
    required:true,
   },
   description:{
    type:String,
   },
   course:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"courseModel",
   }]
});

const categoryModel=mongoose.model("categoryModel",categorySchema);
module.exports=categoryModel;
