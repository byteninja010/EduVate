const courseModel = require("../Models/courses");
const categoryModel = require("../Models/category");
const userModel = require("../Models/users");
const sectionModel = require("../Models/section");
const subSectionModel = require("../Models/subSection");
const ratingAndReviewsModel=require("../Models/ratingAndReviews");
const { uploadImageCloudinary } = require("../utils/imageUploader");
const { convertSecondsToDuration } = require("../utils/secToDuration");
const { json } = require("express");
const courseProgressModel = require("../Models/courseProgress");
require("dotenv").config();
exports.createCourse = async (req, res) => {
  try {
    //Fetch Data
    const {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag,
      category,
    } = req.body;
    //Get thumbnail(it is different as it is uplaoded)
    const thumbnail = req.files.thumbnailImage;
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        msg: "All fields are required",
      });
    }
    //Check for instructor
    //the Cookie we send has the data of the user
    const userId = req.user.id;

    //Checkign whether the given tag is valid or not
    //------In our req we will get tagID (Confusion!!!)-------
    const categoryDetails = await categoryModel.findById(category);
    if (!categoryDetails) {
      return res.status(400).json({
        success: false,
        msg: "Tag is not valid",
      });
    }

    //Uploading file to cloudinary
    const thumbnailImage = await uploadImageCloudinary(
      thumbnail,
      process.env.Folder_Name
    );

    //Create an entry

    const newCourse = await courseModel.create({
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      thumbnail: thumbnailImage.secure_url,
      category: categoryDetails._id,
      instructor: userId,
      tags: tag,
    });

    //Now a user is creater But it is not enough as we have to add the course to the user But no student have not bought this course till now but user is also instructor so if a instructor creates a course he should be able to see it in it myCourse
    await userModel.findByIdAndUpdate(
      { _id: userId },
      {
        //$push is a MongoDB operator that adds a value to an array field.
        $push: {
          courses: newCourse._id,
        },
      },
      //If we had stored the data into a variable than this would have made a difference
      { new: true }
    );
    //Updating categories
    await categoryModel.findByIdAndUpdate(
      { _id: categoryDetails._id },
      {
        //$push is a MongoDB operator that adds a value to an array field.
        $push: {
          course: newCourse._id,
        },
      },
      //If we had stored the data into a variable than this would have made a difference
      { new: true }
    );
    return res.status(200).json({
      sucess: true,
      msg: "New Course is created",
      data: newCourse,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      sucess: false,
      msg: "Some error occured while creating the course kindly try later",
    });
  }
};

exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const updates = req.body;
    if (!courseId) {
      return res.status(404).json({
        success: false,
        msg: "Unable to get course id of the course to be edited!",
      });
    }
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(400).json({
        success: false,
        msg: "Course not found!",
      });
    }
    if (req.files) {
      //Means user want to change thumbnail also
      const thumbnail = req.files.thumbnailImage;
      const thumbnailImage = await uploadImageCloudinary(
        thumbnail,
        process.env.Folder_Name
      );
      course.thumbnail = thumbnailImage.secure_url;
    }

    for (const key in updates) {
      if (key != courseId) {
        // Don't try to parse category as JSON since it's already a string (category ID)
        course[key] = updates[key];
      }
    }
    await course.save();
    const updatedCourse = await courseModel
      .findOne({
        _id: courseId,
      })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      msg: "Something went wrong while editing the course!",
    });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    //{} empty braces means that we want all the data as we are not passing any condition
    const allCourses = await courseModel
      .find(
        {},
        {
          courseName: true,
          price: true,
          thumbnail: true,
          instructor: true,
          ratingAndReviews: true,
          studentsEnrolled: true,
        }
      )
      //populate makes the id to the real form of data
      .populate("instructor")
      /*
    .exec() is a method in Mongoose that is used to execute a query and return a Promise.

Without .exec(), many Mongoose queries return a "query object" instead of immediately running the query. By calling .exec(), you explicitly tell Mongoose to execute the query and return the results.

If you're using async/await, you often need .exec() because await works on Promises. By using .exec(), you're ensuring that the query is executed and the result is returned as a Promise that can be awaited.
    */
      .exec();

    return res.status(200).json({
      success: true,
      msg: "All courese fetched",
      data: allCourses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      sucess: false,
      msg: "There is a error in fetching the courses",
    });
  }
};

exports.getCourseDetails = async (req, res) => {
  try {
    //Fetching course id
    const { courseId } = req.body;
    //Validating the data
    if (!courseId) {
      return res.status(400).json({
        success: false,
        msg: "Course field can not be empty!",
      });
    }
    //Fetching the courseDetails
    const courseDetails = await courseModel
      .findById(courseId)
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
          //We can't give url (As it will lead to piracy)
          select: "-videoUrl",
        },
      })
      .exec();
    //If course Details are not avaliable
    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        msg: `Could not find with the course id ${courseId}`,
      });
    }
    //Fetching the total duration for the course (How it is done?)
    //We have course content which contains section and there are subsection which has duration
    //Hence converting them to int and adding and finally converting them to a user friendly syntax
    let totalTimeDuration = 0;
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDuration = parseInt(subSection.timeDuration);
        totalTimeDuration += timeDuration;
      });
    });

    totalTimeDuration = convertSecondsToDuration(totalTimeDuration);

    return res.status(200).json({
      success: true,
      msg: "Succesfully fetched the course Details",
      data: { courseDetails, totalTimeDuration },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      msg: "Error while getting the course details",
    });
  }
};

exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;
    const courseDetails = await courseModel
      .findOne({
        _id: courseId,
      })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    let courseProgressCount = await courseProgressModel.findOne({
      courseID: courseId,
      userId: userId,
    });

    console.log("courseProgressCount : ", courseProgressCount);

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      });
    }
    let totalDurationInSeconds = 0;
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration);
        totalDurationInSeconds += timeDurationInSeconds;
      });
    });

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);
    let completedVideos;
    if (courseProgressCount && courseProgressCount.completedVideos) {
      completedVideos = courseProgressCount.completedVideos;
    } else {
      completedVideos = [];
    }
    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: completedVideos,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getInstructorCourse = async (req, res) => {
  try {
    const instructorId = req.user.id;
    const instructorCourses = await courseModel
      .find({
        instructor: instructorId,
      })
      .sort({ createdAt: -1 });
    if (!instructorCourses) {
      return res.status(400).json({
        success: false,
        msg: "No course found of the particular instructor",
      });
    }
    res.status(200).json({
      success: true,
      msg: "The course of the instructor are given as following",
      data: instructorCourses,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      msg: "Error in getting the courses of the particular instructor",
    });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(404).json({
        success: false,
        msg: "Course id is required to delete the courseId",
      });
    }
    const course = await courseModel.findById(courseId);
    const user_enrolled = course.studentsEnrolled;
    //unenrolling the student in the course
    //Can't use for each it does not works with async await
    //Can use maps or for loops like used later
    //Prime difference between this map and the later for(const x of y) loop is that map is parllel execution and for loop is serial so parllel can outperform serial loop
    await Promise.all(
      user_enrolled.map(async (studentId) => {
        try {
          await userModel.findByIdAndUpdate(studentId, {
            $pull: { courses: courseId },
          });
        } catch (error) {
          console.error(`Error unenrolling student ${studentId}:`, error);
          res.status(500).json({
            success: false,
            msg: "Error in unenrolling student from the course",
          });
        }
      })
    );

    //Deleting the section and subsection because they can't be independent
    try {
      const sections = course.courseContent;
      for (const sectionId of sections) {
        const section = await sectionModel.findById({ _id: sectionId });
        if (section) {
          const subSections = section.subSection;
          for (const subSecId of subSections) {
            await subSectionModel.findByIdAndDelete(subSecId);
          }
        }
        await sectionModel.findByIdAndDelete({ _id: sectionId });
      }
    } catch (error) {
      console.error(`Error deleting section`, error);
      res.status(500).json({
        success: false,
        msg: "Error in deleting sections from the course",
      });
    }

    //Now we are free to delete the course
    await courseModel.findByIdAndDelete({ _id: courseId });
    res.status(200).json({
      success: true,
      msg: "Course Deleted succesfully",
    });
  } catch (err) {
    console.error("Error in delete course", err);
    return res.status(500).json({
      success: false,
      msg: "Error in deleting the course!!",
    });
  }
};
