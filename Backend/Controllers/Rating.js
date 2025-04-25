const ratingAndReviewsModel=require("../Models/ratingAndReviews");
const userModel=require("../Models/users");
const courseModel=require("../Models/courses");
exports.createRating=async(req,res)=>{
    try{
        const userId=req.user.id;
        const {rating,review,courseId}=req.body;
        if(!rating || !review){
            return res.status(400).json({
                success:false,
                msg:"Data fields are missing!"
            });
        }
        //Checking whether the user is enrolled for the course he is trying to rate
        const course=await courseModel.findById(courseId);
        if(!course){
            return res.status(404).json({
                success:false,
                msg:"Not able to find the course"
            });
        }
        const userEnrolled=course.studentsEnrolled;
        if(!(userId  in userEnrolled)){
            return res.status(401).json({
                success:false,
                msg:"User is not enrolled in the course"
            });
        }
        //Check whether user has already rated the course or not
        const rated=await ratingAndReviewsModel.findOne({
            course:courseId,
            user:userId
        });
        if(rated){
            return res.status(400).json({
                success:false,
                msg:"Course is already reviewed by the user"
            });
        }
        const RatingAndReview=await ratingAndReviewsModel.create({
            user:userId,
            rating,
            review,
            course:courseId
        }
        );
        const updatedCourseDetails=await courseModel.findByIdAndUpdate({_id:courseId},{
            $push:{
                ratingAndReviews:RatingAndReview._id
            }
        });
        return res.status(200).json({
            success:true,
            msg:"Sucessfully review created",
            data:RatingAndReview,
            updatedCourseDetails
        });
    }catch(e){
        console.error(e);
        res.status(500).json({
            success:false,
            msg:"Internal server error during review creation"
        });
    }
   

}

exports.getAverageRating = async (req, res) => {
    try {
            //get course ID
            const courseId = req.body.courseId;
            //calculate avg rating

            const result = await ratingAndReviewsModel.aggregate([
                {
                    $match:{
                        course: new mongoose.Types.ObjectId(courseId),
                    },
                },
                {
                    $group:{
                        _id:null,
                        averageRating: { $avg: "$rating"},
                    }
                }
            ])

            //return rating
            if(result.length > 0) {

                return res.status(200).json({
                    success:true,
                    averageRating: result[0].averageRating,
                })

            }
            
            //if no rating/Review exist
            return res.status(200).json({
                success:true,
                message:'Average Rating is 0, no ratings given till now',
                averageRating:0,
            })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}


exports.getAllRating=async(req,res)=>{
    try{
        const allReviews=await ratingAndReviewsModel.find({}).sort({rating:"desc"}).populate({
            path:"user",
            select:"firstName lastName email image"

        }).populate({
            path:"course",
            select:"courseName"
        });
        return res.staus(200).json({
            success:true,
            msg:"All reviewes fetched succesfully",
            data:allReviews,
        });
    }catch(e){
        console.error(e);
        return res.status(500).json({
            success:false,
            msg:"Something went wrong while fetching all the reviews"
        })
    }
}
