import React from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom"
import { login } from '../../../services/operations/authAPI'
const LoginForm = () => {
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const [showPass,setShowPass]=useState(false);
   const handleShowPass=()=>{
      setShowPass((prev)=>!prev);
    }
    const [formData,setFormData]=useState({
      email:"",
      password:""
    });

    const handleFormData = (e) => {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
    const handleFormSubmit=(e)=>{
      e.preventDefault();
      dispatch(login(formData.email,formData.password,navigate));
      
    }
  return (
   
    <div>
        <form className='mt-4 flex flex-col w-full' onSubmit={handleFormSubmit}>
        <label>
        <p className='text-richblack-100'>Email Address<sup className='text-pink-200'>*</sup></p>
        <input onChange={handleFormData} required type="text" placeholder='Enter email address' name='email' className='w-full rounded-md bg-richblack-800 text-richblack-200 p-3 mt-2'  style={{ boxShadow: "rgba(255, 255, 255, 0.18) 0px -1px 0px inset" }}/>
        </label>
        <label className='relative'>
        <p className='text-richblack-100 mt-2'>Password<sup className='text-pink-200'>*</sup></p>
        <input onChange={handleFormData} required type={`${showPass?"text":"password"}`} placeholder='Enter password' name='password' className='w-full rounded-md bg-richblack-800 text-richblack-200 p-3 mt-2'  style={{ boxShadow: "rgba(255, 255, 255, 0.18) 0px -1px 0px inset" }}/>
        <span onClick={handleShowPass}>{showPass?<AiOutlineEyeInvisible className='text-richblack-5 absolute text-2xl right-3 top-[53px]'/>:<AiOutlineEye className='text-richblack-5 absolute text-2xl right-3 top-[53px]'/>}</span>
        </label>
        <button className='w-full bg-yellow-50 font-semibold rounded-md p-3 mt-6' type='submit'>Sign in</button>
        </form>
    </div>
  )
}

export default LoginForm