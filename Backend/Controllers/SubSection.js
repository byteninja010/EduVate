const subSectionModel = require("../Models/subSection");
const sectionModel = require("../Models/section");
const { uploadImageCloudinary } = require("../utils/imageUploader");

exports.createSubSection = async (req, res) => {
  try {
    //Reading data from the req
    const { sectionId, title, description } = req.body;
    //Extracting video
    const video = req.files.videoFile;

    //validating the data
    if (!sectionId || !title || !description || !video) {
      return res.status(400).json({
        success: false,
        msg: "Missing Fields!!",
      });
    }
    //uploading video to cloudinary so that we can get a securd video url
    const uploadedVideoDetails = await uploadImageCloudinary(
      video,
      process.env.FOLDER_NAME
    );
    
    //Now creating a subsection
    const newSubSection = await subSectionModel.create({
      title: title,
      timeDuration: `${uploadedVideoDetails.duration}`,
      description: description,
      videoUrl: uploadedVideoDetails.secure_url,
    });
    //Updating Section with Subsection

    const updatedSection = await sectionModel.findByIdAndUpdate(
      { _id: sectionId },
      { $push: { subSection: newSubSection._id } },
      { new: true }
    ).populate("subSection");
    res.status(200).json({
      success: true,
      msg: "New Subsection Succesfully Created!",
      updatedSection,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      msg: "Something went wrong kindly try later",
    });
  }
};

exports.updateSubSection=async(req,res)=>{
    try {
        const { title, subSectionId,sectionId,description } = req.body;
        if(!subSectionId){
          return res.status(400).json({
            success:false,
            msg:"Error in fetching the subSection ID"
          });
        }
        const subSecDetails=await subSectionModel.findById(
          {_id:subSectionId}
        );
        //Data validation
        if(title!==undefined){
          subSecDetails.title=title;
        }
        if(description!==undefined){
          subSecDetails.description=description;
        }
        if(req.files && req.files.videoFile!==undefined){
          const video=req.files.videoFile;
          const uploadedDetails=await uploadImageCloudinary(video,process.env.FOLDER_NAME);
          subSecDetails.videoUrl=uploadedDetails.secure_url;
          subSecDetails.timeDuration=`${uploadedDetails.duration}`;
        }
        //Updating the section
       await subSecDetails.save();
       const updatedSection=await sectionModel.findById({_id:sectionId}).populate("subSection");
        res.status(200).json({
          success: true,
          msg: "Section Updated Succesfully",
          data:updatedSection,
        });
      } catch (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          msg: "Something Went wrong Kindly try later!!",
        });
      }
};

exports.deleteSubSection=async(req,res)=>{
   
  try{
    const {subSectionId,sectionId}=req.body;
    if(!subSectionId || !sectionId){
      return res.status(400).json({
        success:false,
        msg:"Not able to get subSectionId or sectionID"
      })
    }
    const updatedSection=await sectionModel.findByIdAndUpdate({_id:sectionId},{
      $pull:{
        subSection:subSectionId
      }
    },{new:true}).populate("subSection");
   await subSectionModel.findByIdAndDelete({_id:subSectionId});
    return res.status(200).json({
      success:true,
      msg:"Sub Section Succesfully deleted",
      data:updatedSection
    })
  }catch(err){
    console.log(err);
    return res.status(500).json({
      success: false,
      msg: "Something Went wrong Kindly try later!!",
    });
  }
}