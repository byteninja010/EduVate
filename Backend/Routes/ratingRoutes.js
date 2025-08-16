const express = require("express");
const { auth } = require("../middlewares/auth");
const {
    createRating,
    getAverageRating,
    getCourseRatings,
    updateRating,
    deleteRating,
    getAllRatings
} = require("../Controllers/Rating");

const router = express.Router();

// Create a new rating and review
router.post("/createRating", auth, createRating);

// Get average rating for a course
router.get("/getAverageRating/:courseId", getAverageRating);

// Get all ratings for a specific course
router.get("/getCourseRatings/:courseId", getCourseRatings);

// Update a rating (only by the user who created it)
router.put("/updateRating/:ratingId", auth, updateRating);

// Delete a rating (only by the user who created it)
router.delete("/deleteRating/:ratingId", auth, deleteRating);

// Get all ratings (admin only - can be used for analytics)
router.get("/getAllRatings", auth, getAllRatings);

module.exports = router;
