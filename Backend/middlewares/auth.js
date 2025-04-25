const userModule=require("../Models/users");
const jwt=require("jsonwebtoken");

//auth
exports.auth=async (req,res,next)=>{
    try{
        //Extract token
        const token = (req.cookies && req.cookies.token) ||
              (req.body && req.body.token) ||
              (req.header("Authorization") && req.header("Authorization").replace("Bearer ", ""));
        //If token is missing
        if(!token){
            return res.status(401).json({
                success:false,
                msg:"Token is missing",
            });
        }
      
        try{
            const decode=await jwt.verify(token,process.env.JWT_SECRET);
           // console.log(decode);
            req.user=decode;
        }catch(err){
            //Verification error
            return res.status(401).json({
                success:false,
                msg:"token is invalid",
            });
        }
        next();
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            msg:"Server issue kindly try later",
        });
    }

}

exports.isStudent=async (req,res,next)=>{
    try{
        if(req.user.accountType!="Student"){
            return res.status(401).json({
                success:"false",
                msg:"This is protected route for student only"
            })
        }
        next();
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            msg:"Error in verifying the student route"
        });
    }

}


exports.isInstructor=async (req,res,next)=>{
    try{
        if(req.user.accountType!="Instructor"){
            return res.status(401).json({
                success:"false",
                msg:"This is protected route for instructor only"
            })
            
        }
        
        next();
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            msg:"Error in verifying the instructor route"
        });
    }

}

exports.isAdmin=async (req,res,next)=>{
    try{
        if(req.user.accountType!="Admin"){
            return res.status(401).json({
                success:"false",
                msg:"This is protected route for Admin only"
            })
            
        }
        next();
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            msg:"Error in verifying the admin route"
        });
    }

}