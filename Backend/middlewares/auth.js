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
            req.user=decode;
            
            // Check if user is banned
            const user = await userModule.findById(decode.id);
            if (user && user.isBanned) {
                return res.status(403).json({
                    success: false,
                    msg: "Your account has been banned. Please contact administration at admin@eduvate.in",
                    isBanned: true
                });
            }
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

// Check if user is banned
exports.checkBanStatus = async (req, res, next) => {
    try {
        const user = await userModule.findById(req.user.id);
        if (user && user.isBanned) {
            return res.status(403).json({
                success: false,
                msg: "Your account has been banned. Please contact administration at admin@eduvate.in",
                isBanned: true
            });
        }
        next();
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            msg: "Error in checking ban status"
        });
    }
}