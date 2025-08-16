const mongoose = require("mongoose");

const ratingAndReviewsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    review: {
        type: String,
        required: true,
        trim: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "courseModel",
        required: true
    }
}, { timestamps: true });

const ratingAndReviewsModel = mongoose.model("ratingAndReviewsModel", ratingAndReviewsSchema);
module.exports = ratingAndReviewsModel;
