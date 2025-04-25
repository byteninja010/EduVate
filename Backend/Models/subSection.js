const mongoose=require("mongoose");
const cloudinary = require('cloudinary').v2
const subSectionSchema=new mongoose.Schema({
   title:{
    type:String,
    required:true,
   },
  timeDuration:{
    type:String,
    required:true,
  },
  description:{
    type:String,
    required:true,
  },
  videoUrl:{
    type:String,
    required:true,
  },
  additionalUrl:{
    type:String,
  }
   

});
subSectionSchema.post('findOneAndDelete', async function (doc) {
  if (doc && doc.videoUrl) {
    try {
      // Extract public_id from secure_url
      const publicId = doc.videoUrl
        .split('/')
        .slice(-2)
        .join('/')
        .split('.')[0]; // Removes file extension

      await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
      console.log("Video deleted from Cloudinary");
    } catch (error) {
      console.error("Error deleting video from Cloudinary:", error);
    }
  }
});
const subSectionModel=mongoose.model("subSectionModel",subSectionSchema);
module.exports=subSectionModel;
