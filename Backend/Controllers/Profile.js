const userModel = require("../Models/users");
const profileModel = require("../Models/profile");
require("dotenv").config();
const { uploadImageCloudinary } = require("../utils/imageUploader");
const {convertSecondsToDuration} = require("../utils/secToDuration");
const courseProgressModel = require("../Models/courseProgress");
/*As when we have created the user(in sign up controller we have also made user and made
profile as a object inside and we have initilised the profile as null in the user 
itself so we don't have tp create a profile for the user

we could have also done by the method of creating and putting it in user it was equally fine
but it's just we took a different approach as it could help initilse thing as every user
will have profile it's like it's upto him whether he fills the details or not*/

exports.updateProfile = async (req, res) => {
  try {
    // Fetching data as the data is optional
    let { gender, dob, about, contactNumber } = req.body;

    // Getting userID (assuming user is already logged in)
    const userId = req.user.id;

    // No validation here as fields are optional, similar to your original intent

    // Finding the user's profile ID from the user model
    const userDetails = await userModel.findById({ _id: userId });
    const profileId = userDetails.additionalDetails;

    // Prepare the fields that need to be updated
    const updatedFields = {};

    // Only add fields to `updatedFields` if they are defined in the request
    if (dob !== undefined) updatedFields.dob = dob;
    if (gender !== undefined) updatedFields.gender = gender;
    if (about !== undefined) updatedFields.about = about;
    if (contactNumber !== undefined)
      updatedFields.contactNumber = contactNumber;

    // Update the profile directly using `findByIdAndUpdate` and $set
    const profileDetails = await profileModel.findByIdAndUpdate(
      { _id: profileId },
      { $set: updatedFields }, // This will update only the fields that are present in `updatedFields`
      { new: true } // Option to return the updated profile after the update
    );

    const userData = await userModel
      .findById(userId)
      .populate("additionalDetails");
    // Now `profileDetails` will contain the updated document
    return res.status(200).json({
      success: true,
      msg: "Profile Succesfully updated",
      data: userData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: "Something went wrong while updating profile kindly try later!",
    });
  }
};

//Delete Account
exports.deleteAccount = async (req, res) => {
  try {
    //Fetching id of the user
    const userId = req.user.id;
    const userDetails = await userModel.findById({ _id: userId });
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        msg: "Error to fetch the data of the user",
      });
    }
    //Firstly deleting profile than deleting profileId
    const profileId = userDetails.additionalDetails;
    await profileModel.findByIdAndDelete({ _id: profileId });

    //Deleting the user
    await userModel.findByIdAndDelete({ _id: userId });

    return res.status(200).json({
      success: true,
      msg: "Account deleted succesfully!!",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      msg: "Error while deleting account",
    });
  }
};

exports.updateProfilePicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture;
    if (!displayPicture) {
      return res.status(500).json({
        success: false,
        msg: "Kindly give the file to update the profile picture",
      });
    }
    const userId = req.user.id;
    const image = await uploadImageCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );
    console.log(image);
    const updatedProfile = await userModel.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      msg: "Profile Picture updated succesfully",
      data: updatedProfile,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      msg: "Internal server issue while updating the profile picture",
    });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const userDetails = await userModel
      .findById(userId)
      .select("-password -otp")
      .populate("additionalDetails");

    console.log(userDetails);
    res.status(200).json({
      success: true,
      msg: "User details succesfully fetched",
      userDetails,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      msg: "Internal error while fetching the user Details",
    });
  }
};

exports.getAllUserDetails = async (req, res) => {
  try {
    const allUserDetails = await userModel
      .find({})
      .populate("additionalDetails");
    res.status(200).json({
      success: true,
      msg: "Users details succesfully fetched",
      allUserDetails,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      msg: "Internal Server issue while getting all the users",
    });
  }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userID = req.user.id;
    let userDetails = await userModel
      .findById({ _id: userID })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec();
      if(!userDetails){
        return res.status(400).json({
          success:false,
          msg:"User not found!"
        });
      }
    //Converting the mongoDb doc to object
    userDetails = userDetails.toObject();
    var SubSectionLength = 0;
    for (var i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSecond = 0;
      SubSectionLength = 0;
      for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        totalDurationInSecond += userDetails.courses[i].courseContent[
          j
        ].subSection.reduce(
          (acc, curr) => acc + parseInt(curr.timeDuration),
          0
        );
        SubSectionLength +=
          userDetails.courses[i].courseContent[j].subSection.length;
      }
      userDetails.courses[i].totalDuration =
        convertSecondsToDuration(totalDurationInSecond);
        const courseProgress = await courseProgressModel.findOne({
          courseId: userDetails.courses[i]._id,
          userId: userID,
        });
    
        // Get the number of completed videos (handle case if courseProgress is null)
        const completedVideos = courseProgress?.completedVideos.length || 0;
    
        // Calculate progress percentage
        userDetails.courses[i].progressPercentage =
          SubSectionLength === 0
            ? 100
            : Number(((completedVideos / SubSectionLength) * 100).toFixed(2));
    
    }
    // Fetch user's course progress
   
      return res.status(200).json({
        success:true,
        data:userDetails.courses
      })
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success:false,
      msg:"Internal Server Error"
    })
  }
};
