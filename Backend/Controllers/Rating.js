const ratingAndReviewsModel = require("../Models/ratingAndReviews");
const userModel = require("../Models/users");
const courseModel = require("../Models/courses");
const mongoose = require("mongoose");

exports.createRating = async (req, res) => {
    try {
        const userId = req.user.id;
        const { rating, review, courseId } = req.body;
        
        if (!rating || !review || !courseId) {
            return res.status(400).json({
                success: false,
                msg: "Rating, review, and courseId are required!"
            });
        }

        // Validate rating range
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                msg: "Rating must be between 1 and 5"
            });
        }

        // Check if course exists
        const course = await courseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                msg: "Course not found"
            });
        }

        // Check if user is enrolled in the course
        const userEnrolled = course.studentsEnrolled;
        if (!userEnrolled.includes(userId)) {
            return res.status(401).json({
                success: false,
                msg: "User is not enrolled in the course"
            });
        }

        // Check if user has already rated the course
        const existingRating = await ratingAndReviewsModel.findOne({
            course: courseId,
            user: userId
        });
        
        if (existingRating) {
            return res.status(400).json({
                success: false,
                msg: "Course is already reviewed by the user"
            });
        }

        // Create the rating and review
        const ratingAndReview = await ratingAndReviewsModel.create({
            user: userId,
            rating,
            review,
            course: courseId
        });

        // Add rating to course
        await courseModel.findByIdAndUpdate(
            { _id: courseId },
            {
                $push: {
                    ratingAndReviews: ratingAndReview._id
                }
            }
        );

        // Populate user details for response
        const populatedRating = await ratingAndReviewsModel.findById(ratingAndReview._id)
            .populate({
                path: "user",
                select: "firstName lastName email image"
            });

        return res.status(200).json({
            success: true,
            msg: "Review created successfully",
            data: populatedRating
        });
    } catch (error) {
        console.error("Error creating rating:", error);
        res.status(500).json({
            success: false,
            msg: "Internal server error during review creation"
        });
    }
};

exports.getAverageRating = async (req, res) => {
    try {
        const { courseId } = req.params;
        
        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "Course ID is required"
            });
        }

        const result = await ratingAndReviewsModel.aggregate([
            {
                $match: {
                    course: new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" },
                    totalRatings: { $sum: 1 }
                }
            }
        ]);

        if (result.length > 0) {
            return res.status(200).json({
                success: true,
                averageRating: Math.round(result[0].averageRating * 10) / 10,
                totalRatings: result[0].totalRatings
            });
        }

        return res.status(200).json({
            success: true,
            message: 'No ratings given yet',
            averageRating: 0,
            totalRatings: 0
        });
    } catch (error) {
        console.log("Error getting average rating:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getCourseRatings = async (req, res) => {
    try {
        const { courseId } = req.params;
        
        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "Course ID is required"
            });
        }

        const ratings = await ratingAndReviewsModel.find({ course: courseId })
            .populate({
                path: "user",
                select: "firstName lastName email image"
            })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Course ratings fetched successfully",
            data: ratings
        });
    } catch (error) {
        console.error("Error fetching course ratings:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch course ratings"
        });
    }
};

exports.updateRating = async (req, res) => {
    try {
        const userId = req.user.id;
        const { ratingId } = req.params;
        const { rating, review } = req.body;

        if (!rating || !review) {
            return res.status(400).json({
                success: false,
                msg: "Rating and review are required!"
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                msg: "Rating must be between 1 and 5"
            });
        }

        // Check if rating exists and belongs to user
        const existingRating = await ratingAndReviewsModel.findById(ratingId);
        if (!existingRating) {
            return res.status(404).json({
                success: false,
                msg: "Rating not found"
            });
        }

        if (existingRating.user.toString() !== userId) {
            return res.status(403).json({
                success: false,
                msg: "You can only update your own ratings"
            });
        }

        // Update the rating
        const updatedRating = await ratingAndReviewsModel.findByIdAndUpdate(
            ratingId,
            { rating, review },
            { new: true }
        );

        // Populate user details separately
        const populatedRating = await ratingAndReviewsModel.findById(updatedRating._id)
            .populate({
                path: "user",
                select: "firstName lastName email image"
            });

        return res.status(200).json({
            success: true,
            msg: "Rating updated successfully",
            data: populatedRating
        });
    } catch (error) {
        console.error("Error updating rating:", error);
        res.status(500).json({
            success: false,
            msg: "Internal server error during rating update"
        });
    }
};

exports.deleteRating = async (req, res) => {
    try {
        const userId = req.user.id;
        const { ratingId } = req.params;

        // Check if rating exists and belongs to user
        const existingRating = await ratingAndReviewsModel.findById(ratingId);
        if (!existingRating) {
            return res.status(404).json({
                success: false,
                msg: "Rating not found"
            });
        }

        if (existingRating.user.toString() !== userId) {
            return res.status(403).json({
                success: false,
                msg: "You can only delete your own ratings"
            });
        }

        // Remove rating from course
        await courseModel.findByIdAndUpdate(
            existingRating.course,
            {
                $pull: {
                    ratingAndReviews: ratingId
                }
            }
        );

        // Delete the rating
        await ratingAndReviewsModel.findByIdAndDelete(ratingId);

        return res.status(200).json({
            success: true,
            msg: "Rating deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting rating:", error);
        res.status(500).json({
            success: false,
            msg: "Internal server error during rating deletion"
        });
    }
};

exports.getAllRatings = async (req, res) => {
    try {
        const allReviews = await ratingAndReviewsModel.find({})
            .sort({ rating: "desc" })
            .populate({
                path: "user",
                select: "firstName lastName email image"
            })
            .populate({
                path: "course",
                select: "courseName"
            });

        return res.status(200).json({
            success: true,
            msg: "All reviews fetched successfully",
            data: allReviews,
        });
    } catch (error) {
        console.error("Error fetching all ratings:", error);
        return res.status(500).json({
            success: false,
            msg: "Something went wrong while fetching all the reviews"
        });
    }
};
