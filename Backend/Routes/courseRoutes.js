const express=require("express");
const router=express.Router();

const {auth,isInstructor,isAdmin}=require("../middlewares/auth");
const {createCourse,getAllCourses,getCourseDetails,getInstructorCourse,deleteCourse, editCourse}=require("../Controllers/Courses");
const {createCategory,showAllCategories,coursesByCategory}=require("../Controllers/Category");
const {createSection,updateSection,deleteSection}=require("../Controllers/Section");
const{createSubSection,updateSubSection,deleteSubSection}=require("../Controllers/SubSection");
//Create a new Course
router.post("/createCourse",auth,isInstructor,createCourse);
router.post("/getCourseDetails",getCourseDetails);
router.get("/getAllCourses",getAllCourses);
router.get("/getInstructorCourses",auth,getInstructorCourse);
router.post("/editCourse",auth,isInstructor,editCourse);
router.post("/deleteCourse",auth,isInstructor,deleteCourse);
//Create a category
router.post("/createCategory",auth,isAdmin,createCategory);
router.get("/showAllCategories",showAllCategories);
router.post("/coursesByCategory",coursesByCategory);


router.post("/addSection", auth, isInstructor, createSection);
// Update a Section
router.post("/updateSection", auth, isInstructor, updateSection);
// Delete a Section
router.delete("/deleteSection", auth, isInstructor, deleteSection);

router.post("/createSubSection",auth,isInstructor,createSubSection);

router.post("/updateSubSection",auth,isInstructor,updateSubSection);

router.delete("/deleteSubSection",auth,isInstructor,deleteSubSection);
module.exports=router;
