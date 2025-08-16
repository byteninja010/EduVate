const express=require("express");
const dbConnect=require("./config/database");
const app=express();
const port=4000;
require("dotenv").config();
const cors=require("cors");
const fileUpload=require("express-fileupload");
const cookieParser=require("cookie-parser");
const {cloudinaryConnect}=require("./config/cloudinary");
const userRoutes=require("./Routes/userRoutes");
const profileRoutes=require("./Routes/profileRoutes");
const courseRoutes=require("./Routes/courseRoutes");
const courseProgressRoutes=require("./Routes/courseProgressRoutes");
const contactRoutes=require("./Routes/contactRoutes");
const walletRoutes=require("./Routes/walletRoutes");
app.use(express.json());
app.use(
	cors({
		origin: "*",
		credentials: true,
	})
);
app.use(
	fileUpload({
		useTempFiles:true,
		tempFileDir:"/tmp",
	})
);
 app.use(cookieParser());
app.listen(port,()=>{
    console.log("Listening on port 4000");
});
dbConnect();
cloudinaryConnect();
app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/profile",profileRoutes);
app.use("/api/v1/course",courseRoutes);
app.use("/api/v1/courseProgress",courseProgressRoutes);
app.use("/api/v1/contact",contactRoutes);
app.use("/api/v1/wallet",walletRoutes);




