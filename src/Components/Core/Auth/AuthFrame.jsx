import React from 'react'
import frame from '../../../assets/Images/frame.png'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
const AuthFrame = ({title,des1,des2,image,formtype}) => {
    return (
        <div>
            <div className='w-11/12 max-w-maxContent flex lg:flex-row flex-col-reverse justify-between mx-auto my-16 px-5 items-center'>
                <div className='flex flex-col gap-2 w-11/12 max-w-[450px] mt-5'>
                    <div className='text-3xl text-richblack-5 font-semibold'>{title}</div>
                    <div className='text-richblack-100 text-lg'>{des1}</div>
                    <div className='font-edu-sa text-blue-100 italic font-bold'>{des2}</div>
                    {formtype==='login'?<LoginForm/>:<SignupForm/>}
                </div>
                <div className='relative max-w-[450px] w-11/12'>
                  <img src={`${frame}`}alt=""/>
                  <img src={`${image}`} alt="signup-img" className='absolute -top-4 right-4'/>               
                </div>
            </div>
        </div>
      )
}

export default AuthFrame