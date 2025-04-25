import React from 'react'
import AuthFrame from '../Components/Core/Auth/AuthFrame'
import signup from "../assets/Images/signup.webp"
const Signup = () => {
  return (
     <AuthFrame
      title={"Join the millions learning to code with StudyNotion for free"}
      des1={"Build Skills for today,tommorow and beyond"}
      des2={"Education to future-proof your career."}
      image={signup}
      formtype={"signup"}
    />
  )
}

export default Signup