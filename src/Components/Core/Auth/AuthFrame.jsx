import React from 'react'
import frame from '../../../assets/Images/frame.png'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
import { Link } from 'react-router-dom'

const AuthFrame = ({title,des1,des2,image,formtype}) => {
    return (
        <div>
            <div className='w-11/12 max-w-maxContent flex lg:flex-row flex-col-reverse justify-between mx-auto my-8 md:my-16 px-2 md:px-5 items-center'>
                <div className='flex flex-col gap-2 w-11/12 max-w-[450px] mt-5'>
                    <div className='text-2xl md:text-3xl text-richblack-5 font-semibold text-center lg:text-left'>{title}</div>
                    <div className='text-base md:text-lg text-richblack-100 text-center lg:text-left'>{des1}</div>
                    <div className='font-edu-sa text-blue-100 italic font-bold text-center lg:text-left'>{des2}</div>
                    {formtype==='login'?<LoginForm/>:<SignupForm/>}
                    
                    {/* User Choice Section */}
                    <div className='mt-6 pt-6 border-t border-richblack-700 text-center'>
                        <p className='text-richblack-300 text-sm mb-3'>
                            {formtype === 'login' ? "Don't have an account?" : "Already have an account?"}
                        </p>
                        <Link 
                            to={formtype === 'login' ? '/signup' : '/login'}
                            className='inline-flex items-center gap-2 text-yellow-25 hover:text-yellow-50 transition-colors duration-200 font-medium'
                        >
                            {formtype === 'login' ? 'Sign up here' : 'Log in here'}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </div>
                <div className='relative max-w-[350px] md:max-w-[450px] w-11/12 hidden md:block'>
                  <img src={`${frame}`}alt=""/>
                  <img src={`${image}`} alt="signup-img" className='absolute -top-4 right-4'/>               
                </div>
            </div>
        </div>
      )
}

export default AuthFrame