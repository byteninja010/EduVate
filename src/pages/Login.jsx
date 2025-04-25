import React from "react";
import login from "../assets/Images/login.webp";
import AuthFrame from "../Components/Core/Auth/AuthFrame";
const Login = () => {
  return (
    <AuthFrame
      title={"Welcome Back"}
      des1={"Build Skills for today,tommorow and beyond"}
      des2={"Education to future-proof your career."}
      image={login}
      formtype={"login"}
    />
  );
};

export default Login;
