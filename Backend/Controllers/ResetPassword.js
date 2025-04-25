const userModel=require("../Models/users");
const mailSender=require("../utils/sendVerificationEmail");

exports.resetPasswordToken=async(req,res)=>{
    try{
        //Get email from req body
    const {email}=req.body;
    const user=await userModel.findOne({email:email});
    if(!user){
        return res.json({
            success:false,
            msg:"Your email is not registered Firstly make Your account"
        })
    }
    //Creating a unique toke for each user so that we can send a unique link to reset their password
    const token=crypto.randomUUID();
    const updatedDetails=await userModel.findOneAndUpdate(
                {email:email},
                {
                    token:token,
                    resetPasswordExpires:Date.now()+5*60*1000,
                },
                {new:true});
            
        
    const url=`http://localhost:3000/update-password${token}`;
    await mailSender(email,"Password Reset Link",`Password reset link is given as ${url}`);

    return res.json({
        success:true,
        msg:"Email Sent Succesfully , Kindly check the email and change the password",
    });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Something went wrong while sending reset mail Kindly try again',
        });
    }




}


exports.resetPassword=async(req,res)=>{
 try{
       //Fetching data from the req

    //token will be send in req body using the frontend

    const{password,confirmPassword,token}=req.body;
    //Validations:-
    if(password!=confirmPassword){
        return res.json({
            success:false,
            msg:"Password are not matching kindly enter same password for both fields"
        });
    }
    //Get user from the token we have got as user is stored in the database with a parameter named as token

    const userDetails=await user.findOne({
        token:token,
    });

    if(!userDetails){
        return res.json({
            success:false,
            msg:"Token is invalid",
        });
    }
    if(userDetails.resetPasswordExpires<Date,now()){
        return res.json({
            success:false,
            msg:"Link expired Kindly get a new link to do the same",
        })
    }
    //Now as everuthing is fine now hash the password and update the db

    const hashedPassword=await bcrypt.hash(password,10);

    await userModel.findOneAndUpdate({token:token},{password:hashedPassword},{new:true});

    //Returning response

    return res.status(200).json({
        success:true,
        msg:"Password reset Succesfully",
    })
 }catch(e){
    console.log(e);
    return res.status(500).json({
        success:false,
        msg:"There is some issue in resetint the password currently kindly try again later"
    })
 }
}