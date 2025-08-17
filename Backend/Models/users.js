const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
    },
    password:{
        type:String,
        required:true
    },
    accountType:{
        type:String,
        enum:["Student","Instructor","Admin"],
        required:true
    },
    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"profileModel",
    },
    courses:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"courseModel",
        }
    ],
    image:{
        type:String,
    },
    courseProgress:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"courseProgressModel",
    },
    token:{
        type:String,
    },
    resetPasswordExpires:{
        type:Date,
    },
    isBanned:{
        type:Boolean,
        default:false
    }
}, { timestamps: true });

const userModel=mongoose.model("userModel",userSchema);
module.exports=userModel;
