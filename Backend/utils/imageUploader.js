const cloudinary = require('cloudinary').v2
//Assume we have to connected to cloudinary in main file using a connect function desctiberd somewhere

exports.uploadImageCloudinary=async (file,folder,height,quality)=>{
    const options={folder};
    if(height){
        options.height=height;
    }
    if(quality){
        options.quality=quality;
    }
    options.resource_type="auto";

    return await cloudinary.uploader.upload(file.tempFilePath,options);
}