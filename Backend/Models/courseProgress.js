const mongoose=require("mongoose");

//Shows the course progress so basically what we need a course which progress has to be shown
//Along with that we need the data of completed videos or done type things
const courseProgressSchema=new mongoose.Schema({
  courseId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"courseModel",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userModel",
  },
  completedVideos:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"subSectionModel",
  }]

});

const courseProgressModel=mongoose.model("courseProgressModel",courseProgressSchema);
module.exports=courseProgressModel;
