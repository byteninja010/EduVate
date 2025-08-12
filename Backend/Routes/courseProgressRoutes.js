const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const {
  updateCourseProgress,
  getCourseProgress,
  getAllCourseProgress,
} = require("../Controllers/CourseProgress");

// Update course progress (mark video as completed)
router.post("/updateCourseProgress", auth, updateCourseProgress);

// Get course progress for a specific course
router.get("/getCourseProgress", auth, getCourseProgress);

// Get all course progress for a user
router.get("/getAllCourseProgress", auth, getAllCourseProgress);

module.exports = router;
