const { default: mongoose } = require("mongoose");
const {instance}=require("../config/razorpay");
const courseModel=require("../Models/courses");
const userModel=require("../Models/users");
const mailSender=require("../utils/sendVerificationEmail");

//Capture the payment and initiate the Razorpay order

exports.capturePayment=async (req,res)=>{
    const {courseId}=req.body;
    const userId=req.user.id;
    if(!courseId){
        return res.status(400).json({
            status:false,
            msg:"A valid course id is required!"
        })
    }
    //Check whether the course is even avaliable or not
    let course;
    try{
        course=await courseModel.findById(courseId);
        if(!course){
            return res.status(400).json({
                status:false,
                msg:"Invalid Course details!"
            })
        }
      /*  Check whether user has already bought the course or not
        Here we need to convert userId to a objectId type but we don't do thse things when we have functions like findbyid etc WHY??
        The answer is simple mongoose does the internal conversion but here we are using 
        includes which is a js method so we have to explicitally convert
        */
        const uid=new mongoose.Types.ObjectId(userId);
        if(course.studentsEnrolled.includes(uid)){
            return res.status(400).json({
                status:false,
                msg:"User has already bought the course!"
            })
        }
        

    }catch(err){
        console.log(err);
        return res.status(500).json({
            status:false,
            msg:"Internal Server issue during capturing the payment!"
        })
    }

    const price=course.price;
    const currency="INR";
    const options={
        //As razorpay takes amount in paisa instead of rupees
        amount:price*100,
        currency,
        recipt:Math.random(Date.now()).toString(),
        notes:{
            courseId,
            userId,
        }

    }
    try {
        const paymentResponse=await instance.orders.create(options);
        console.log(paymentResponse);
        return res.status(200).json({
            status:true,
            msg:"Payment Created Succesfully",
            courseName:course.courseName,
            thumbnail:course.thumbnail,
            price:course.price,
            orderId:paymentResponse.id,
            currency:paymentResponse.currency,
            amount:paymentResponse.amount
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status:false,
            msg:"Cannot initiate payment"
        });
    }
}


//Verify signature of razorpay and server ( Basically authenthicating the payment)
/*Basically razorpay will send a secret code we will also be having secret code both should match and then only we will move further it will
verify the integrity of payment*/
exports.verifySignature=async(req,res)=>{
    const webHookSecret="abcdef123";
    //This is the location in the headers where the signature is avaliable
    const signature=req.headers["x-razorpay-signature"];

    const shasum=crypto.createHmac("sha256",webHookSecret);
    shasum.update(JSON.stringify(req.body));
    const finalHash=shasum.digest("hex");
    if(signature==finalHash){
        console.log("Payment is authorised");
        //For this only we added notes(which is optional) in our options
        const {courseId,userId}=req.body.payload.payment.entity.notes;

        try {
            //As payment is done and authorised so now we have to add student and other one in each other
            //Basically enrolling the student

            const enrolledCourse=await courseModel.findByIdAndUpdate(courseId,
                                                    {$push:{
                                                        studentsEnrolled:userId,
                                                    }},
                                                    {new:true}
            );
            if(!enrolledCourse){
                return res.status(500).json({
                    status:false,
                    msg:"Course not found"
                });
            }
            console.log(enrolledCourse);

            //Now in student add the particular course
            const enrolledStudent=await userModel.findOneAndUpdate({_id:userId},{
                                        $push:{
                                            courses:courseId
                                        }},
                                        {new:true}
                                    );
         const emailResposne=await mailSender(enrolledStudent.email,"Congratulations you have been enrolled in this course","Congratulation you are onboarded into new Codehelp course");
         return res.status(200).json({
            success:true,
            msg:"Signature verified and Course Added"
         });   

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success:false,
                msg:"Internal server issue during addition of student to the course"
            })
        }

    }else{
        return res.status(400).json({
            success:false,
            msg:"Signature verification failed !! Unauthorised Payment"

        })
    }

};