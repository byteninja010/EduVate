const nodemailer=require('nodemailer');
require("dotenv").config();
const mailSender=async(email,title,body)=>{
    try{
        let transporter=nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS
            }
        })

        let info =await transporter.sendMail({
            from:"EduVate || By-ByteNinja",
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`
        })
    }catch(err){
        console.log(err);
    }
}

module.exports=mailSender;