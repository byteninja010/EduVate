const mongoose=require('mongoose');
const courseSchema=new mongoose.Schema({
    courseName:{
        type:String,
        required:true,
    },
    courseDescription:{
        type:String,
        required:true,
    },
    whatYouWillLearn:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    thumbnail:{
        type:String,
        required:true,
    },
    studentsEnrolled:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"userModel",
        }
    ],
    tags:{
        type:String
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"categoryModel",
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"userModel",
        required:true,
    },
    ratingAndReviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"ratingAndReviewsModel",
    
        }
    ],
    courseContent:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"sectionModel",
        }
    
    ]

});

const courseModel=mongoose.model("courseModel",courseSchema);
module.exports=courseModel; 