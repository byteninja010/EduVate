const mailSender=require("../utils/sendVerificationEmail");
const contactUsTemplate=require("../mailTemplates/contactUsTemplate");
exports.contactUs=async(req,res)=>{
    let {firstName,lastName,email,phoneNo,message,countryCode}=req.body;
    if(!firstName || !email || !phoneNo || !message || !countryCode){
        return res.json({
            success:false,
            msg:"Mandatory fields can't be empty"
        });
    }
    phoneNo=countryCode+phoneNo;
    try{
        await mailSender("byteninja010@gmail.com","Contact Us Email",contactUsTemplate(firstName,lastName,email,phoneNo,message));
        return res.status(200).json({
            success:true,
            msg:"Mail Send Succesfully"
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            msg:"Internal server error during sending of mail"
        })
    }
  


}