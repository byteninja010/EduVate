const userModel=require("../Models/users");
const otpModel=require("../Models/otp");
const otpGenerator=require("otp-generator");
const bcrypt=require("bcrypt");
const profileModel=require("../Models/profile");
const jwt=require("jsonwebtoken");

require("dotenv").config();
//Send Otp
exports.sendOtp=async(req,res)=>{
    try{
        //Extracting email from request
    const {email}=req.body;
    //Check wether user is present or not
    const checkUserPresent=await userModel.findOne({email});
    //As otp feature is only on sign up page if the user is existing it means that he is not registering

    if(checkUserPresent){
        return res.status(401).json({
            success:false,
            msg:'User already Exist!! Kindly login to get access of the website'
        });
    }
    //Now user does not exists so let's generate its otp


    var Otp=otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
    });
    console.log(Otp);
    //Now it is fine we can move further with it but we want that if a user asks for multiple otps let's be sure that he gets a unique otp

    const result = await otpModel.findOne({ otp: Otp });
   
    while(result){
        Otp=otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        result=await otpModel.findOne({otp:Otp});

    }
    //Now at this point we have a uniqueOTP
    //Saving otp in the database
    const otpPayload={
        email,
        otp:Otp};
    const otpBody=await otpModel.create(otpPayload);
    res.status(200).json({
        success:true,
        msg:"Otp send Succesfully",
    })
    }catch(err){
        console.log("Error in sending otp");
        console.log(err);
    }
}

//Sign up Controller

exports.signUp=async(req,res)=>{
    try{
        //data fetching from request 
    const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        otp}=req.body;

        //Validating the data

        if(!firstName || !lastName || !email || !password || !confirmPassword || !accountType || !otp){
           return res.status(403).json({
                success:false,
                msg:"Kindly fill all the field",
            });

        }

        //Checking whether the 2 passwords are matching or not

        if(confirmPassword!=password){
           return res.status(403).json({
                success:false,
                msg:"Password and confirm password are not matching !!",
            });
        }
        //Checking if the user is new or not
        const checkUserPresent=await userModel.findOne({email});

        if(checkUserPresent){
           return res.status(403).json({
                success:false,
                msg:"User already exist",
            })
        }

        //Finding the most unique otp stored here
        //Works for the case when we are in some condition that the same user generated many otps
        const recentOtp=await otpModel.find({email}).sort({createdAt:-1}).limit(1);
        if(recentOtp.length==0){
            return res.status(400).json({
                success:false,
                message:"Otp not found",
            })
        }
       
        if(recentOtp[0].otp!=otp){
            return res.status(403).json({
                success:false,
                message:"Otp did not matched correctly",
            });
        }
     //-----OTP MATCHED---
        //Hash Password

        const hashedPassword=await bcrypt.hash(password,10);

        //Inserting the user
        //Additional references (Optional) so making them if one wants he or she can enter the details
        const profileDetails=await profileModel.create({
            gender:null,
            dob:null,
            about:null,
            contactNumber:null,
        });

        const user=await userModel.create({
            firstName,
            lastName,
            email,
            password:hashedPassword,
            accountType,
            additionalDetails:profileDetails._id,
            image:`https://api.dicebear.com/9.x/initials/svg?seed=${firstName} ${lastName}`,
        });
        return res.status(200).json({
            success:true,
            msg:"User is succesfully registered",
            user
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            msg:"Server issue! Kindly try again later",
        })
    }



}

//Login Controller
exports.login=async (req,res)=>{
    try{
        //Extracting data from req body
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(403).json({
                success:false,
                msg:"Kindly fill all the field",
            });
        }
        //Check whether user exist or not
        //Populate keyword makes the refernce of additional details as the data 
        var user=await userModel.findOne({email}).populate("additionalDetails");
        if(!user){
           return res.status(403).json({
                success:false,
                msg:"Kindly register before login!!",
            })
        }

        //Generate jwt if password are matching

        if(await bcrypt.compare(password,user.password)){
            const payload={
                email:user.email,
                id:user._id,
                accountType:user.accountType,
            }
            const token=jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h",
            });
           user=user.toObject();
            user.token=token;
            user.password=undefined;
            const options={
                expires:new Date(Date.now()+3*24*60*60*1000),
                httpOnly:true,
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"Logged in Successfully",
            });

        }
        else{
            return res.status(403).json({
                success:false,
                msg:"Incorrect password Kindly check again !!"
            });
        }

    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            msg:"Server issue! Kindly try again later",
        });
       
    }
}

exports.changePassword=async(req,res)=>{
    //Extracting data from user body
    const userId=req.user.id;
    const {newPassword,oldPassword}=req.body;
    const userDetails= await userModel.findById(userId);
    //Validation
    if(!newPassword || !oldPassword){
        return res.status(400).json({
            status:false,
            msg:"Data fields are missing"
        });
    }
    try{
        if(!(await bcrypt.compare(oldPassword,userDetails.password))){
            return res.status(400).json({
                status:false,
                msg:"Password is not matching with the orignal password"
    
            })
        }
        const hashedPassword=await bcrypt.hash(newPassword,10);
        //Update Password
        const updatedUser = await userModel.findByIdAndUpdate(
            { _id: userId },
            { password: hashedPassword },
            { new: true }
        );
    
        return res.status(200).json({
            success:true,
            msg:"Password Changed Successfully",
            updatedUser
        })
    
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            msg:"Error during changing the password"
        })
    }
   



    

    


}