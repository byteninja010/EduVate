const courseProgressModel = require("../Models/courseProgress");
const courseModel = require("../Models/courses");
const userModel = require("../Models/users");

// Mark a video as completed
exports.updateCourseProgress = async (req, res) => {
  try {
    const { courseId, subSectionId } = req.body;
    const userId = req.user.id;
    
    if (!courseId || !subSectionId) {
      return res.status(400).json({
        success: false,
        message: "Course ID and Subsection ID are required",
      });
    }

    // Check if user is enrolled in the course
    const course = await courseModel.findById(courseId)
      .populate('studentsEnrolled')
      .populate({
        path: 'courseContent',
        populate: {
          path: 'subSection',
        },
      });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if user is enrolled using the populated studentsEnrolled field
    const isEnrolled = course.studentsEnrolled?.some(student => student._id.toString() === userId);
    
    if (!course.studentsEnrolled || !isEnrolled) {
      return res.status(403).json({
        success: false,
        message: "User is not enrolled in this course",
      });
    }

    // Find or create course progress
    let courseProgress = await courseProgressModel.findOne({
      courseId,
      userId,
    });

    if (!courseProgress) {
      courseProgress = await courseProgressModel.create({
        courseId,
        userId,
        completedVideos: [],
      });
    }

    // Check if video is already marked as completed
    if (courseProgress.completedVideos.includes(subSectionId)) {
      return res.status(200).json({
        success: true,
        message: "Video already marked as completed",
        data: courseProgress,
      });
    }

    // Add video to completed videos
    courseProgress.completedVideos.push(subSectionId);
    await courseProgress.save();

    return res.status(200).json({
      success: true,
      message: "Video marked as completed successfully",
      data: courseProgress,
    });
  } catch (error) {
    console.error("Error updating course progress:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get course progress for a specific course
exports.getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.query;
    const userId = req.user.id;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    // Check if user is enrolled in the course
    const course = await courseModel.findById(courseId)
      .populate('studentsEnrolled')
      .populate({
        path: 'courseContent',
        populate: {
          path: 'subSection',
        },
      });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if user is enrolled using the populated studentsEnrolled field
    const isEnrolled = course.studentsEnrolled?.some(student => student._id.toString() === userId);
    
    if (!course.studentsEnrolled || !isEnrolled) {
      return res.status(403).json({
        success: false,
        message: "User is not enrolled in this course",
      });
    }

    // Get course progress
    const courseProgress = await courseProgressModel.findOne({
      courseId,
      userId,
    });

    if (!courseProgress) {
      return res.status(200).json({
        success: true,
        data: {
          courseId,
          userId,
          completedVideos: [], // Empty array
          progressPercentage: 0,
          totalVideos: 0,
        },
      });
    }

    // Calculate progress percentage with proper null checks
    const totalVideos = course.courseContent?.reduce((total, section) => 
      total + (section.subSection?.length || 0), 0
    ) || 0;
    const completedVideos = courseProgress.completedVideos?.length || 0;
    const progressPercentage = totalVideos > 0 ? (completedVideos / totalVideos) * 100 : 0;

    return res.status(200).json({
      success: true,
      data: {
        ...courseProgress.toObject(),
        progressPercentage: Math.round(progressPercentage),
        totalVideos,
        completedVideos: courseProgress.completedVideos, // Return the actual array, not the length
      },
    });
  } catch (error) {
    console.error("Error getting course progress:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get all course progress for a user
exports.getAllCourseProgress = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all courses the user is enrolled in
    const user = await userModel.findById(userId).populate("courses");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get progress for all enrolled courses
    const allProgress = await courseProgressModel.find({ userId }).populate("courseId");

    const progressData = user.courses.map(course => {
      const progress = allProgress.find(p => p.courseId.toString() === course._id.toString());
      const totalVideos = course.courseContent?.reduce((total, section) => 
        total + (section.subSection?.length || 0), 0
      ) || 0;
      const completedVideos = progress ? (progress.completedVideos?.length || 0) : 0;
      const progressPercentage = totalVideos > 0 ? (completedVideos / totalVideos) * 100 : 0;

      return {
        courseId: course._id,
        courseName: course.courseName,
        thumbnail: course.thumbnail,
        totalVideos,
        completedVideos,
        progressPercentage: Math.round(progressPercentage),
        completedVideosList: progress ? progress.completedVideos : [],
      };
    });

    return res.status(200).json({
      success: true,
      data: progressData,
    });
  } catch (error) {
    console.error("Error getting all course progress:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
