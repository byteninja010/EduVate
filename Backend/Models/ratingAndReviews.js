const mongoose=require("mongoose");
const ratingAndReviewsSchema=new mongoose.Schema({
    user:
        {
            
                type:mongoose.Schema.Types.ObjectId,
                ref:"userModel",
            
        }
    ,
    rating:{
        type:Number,
        required:true,
    },
    review:{
        type:String,
        required:true,
    },
    course:
        {
            
                type:mongoose.Schema.Types.ObjectId,
                ref:"courseModel",
            
        }
    

});

const ratingAndReviewsModel=mongoose.model("ratingAndReviewsModel",ratingAndReviewsSchema);
module.exports=ratingAndReviewsModel;
