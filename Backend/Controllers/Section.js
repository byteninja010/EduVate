const courseModel = require("../Models/courses");
const sectionModel = require("../Models/section");
const subSectionModel=require("../Models/subSection");
exports.createSection = async (req, res) => {
  try {
    //Fetching the data
    const { sectionName, courseId } = req.body;
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Kindly Fill all the field",
      });
    }
    //Creating section
    const newSection = await sectionModel.create({
      sectionName,
    });
    //Updating course with this object id

    const updatedCourseDetails = await courseModel
      .findByIdAndUpdate(
        courseId,
        {
          $push: {
            courseContent: newSection._id,
          },
        },
        { new: true }
      )
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection", // No need to specify model, inferred from schema
        },
      });
    return res.status(200).json({
      success: true,
      msg: "Course Updated sucessfully",
      updatedCourseDetails,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      msg: "Something went wrong try again later!!",
    });
  }
};
exports.updateSection = async (req, res) => {
  try {
    const { sectionName, sectionId } = req.body;
    //Data validation
    if (!sectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Missing details !!",
      });
    }
    //Updating the section
    const updatedSection = await sectionModel.findByIdAndUpdate(
      { _id: sectionId },
      { sectionName },
      { new: true }
    );
    res.status(200).json({
      success: true,
      msg: "Section Updated Succesfully",
      updatedSection,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      msg: "Something Went wrong Kindly try later!!",
    });
  }
};

exports.deleteSection=async(req,res)=>{

  try{
    const {sectionId,courseId}=req.body;
    //Firstly we have to remove the section from course 
    await courseModel.findByIdAndUpdate(courseId,{
      $pull:{
        courseContent:sectionId,
      }
    });
    const section=await sectionModel.findById({_id:sectionId});
    //Now we have to delete the subsections which could be there in the sections
    if(!section){
      return res.status(400).json({
        success:false,
        msg:"Unable to find the section to be deleted"
      });
    }

    await subSectionModel.deleteMany({_id:{$in:section.subSection}});
    const result = await sectionModel.findByIdAndDelete(sectionId);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        msg: "Section not found",
      });
    }
    console.log(result);
    return res.status(200).json({
      success:true,
      msg:"Section Succesfully deleted"
    })
  }catch(err){
    console.log(err);
    return res.status(500).json({
      success: false,
      msg: "Something Went wrong Kindly try later!!",
    });
  }
}
