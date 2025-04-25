const otpTemplate=(otp)=>{
   return` <!DOCTYPE html>
<html>
<head>
    <title>Eduvate OTP Verification</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f9; padding: 20px; margin: 0;">
    <div style="max-width: 500px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); padding: 20px;">
        <h2 style="color: #3b5998; text-align: center; font-size: 24px; margin-top: 0;">Welcome to Eduvate!</h2>
        <p style="color: #333333; font-size: 16px; text-align: center;">Use the OTP below to verify your account.</p>
        
        <div style="background-color: #e9f6ff; color: #004085; padding: 15px; text-align: center; border-radius: 5px; font-size: 22px; font-weight: bold; letter-spacing: 4px; margin: 20px 0;">
            ${otp}
        </div>
        
        <p style="color: #666666; font-size: 14px; line-height: 1.5;">
            If you did not request this code, please ignore this email. The OTP is valid for only 5 minutes.
        </p>
        
        <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;">
        
        <footer style="text-align: center; font-size: 12px; color: #aaaaaa;">
            <p style="margin: 5px 0;">&copy; 2024 Eduvate. All rights reserved.</p>
            <p style="margin: 0;">Eduvate, 123 Edu St, Education City</p>
        </footer>
    </div>
</body>
</html>
`
}
module.exports=otpTemplate;
