const mongoose=require("mongoose");
const sectionSchema=new mongoose.Schema({
   sectionName:{
    type:String,
    required:true,
   },
   subSection:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"subSectionModel",
    }
   ]

});

const sectionModel=mongoose.model("sectionModel",sectionSchema);
module.exports=sectionModel;
