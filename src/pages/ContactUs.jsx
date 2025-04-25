import React from 'react'
import { IoMdChatbubbles } from "react-icons/io";
import { FaGlobeAsia } from "react-icons/fa";
import { MdPhone } from "react-icons/md"
import ContactUsForm from '../Components/Core/ContactUs/ContactUsForm';
const ContactUs = () => {
  return (
    <div className='w-11/12 mx-auto flex flex-row gap-x-48 mt-16'>
        <div className='bg-richblack-800 lg:w-[450px] p-10 flex flex-col gap-y-6 rounded-lg h-[450px]'>
            <div className='flex flex-col'>
                <div className='text-richblack-5 flex flex-row text-lg gap-x-2 font-semibold'>
                <IoMdChatbubbles className='text-richblack-5'/> 
                <p>Chat on Us</p>
                </div>
                <p className='text-richblack-200 ml-3'>Our Friendly team is here to help</p>
                <p className='text-richblack-200 ml-3'>admin@eduvate.com</p>
            </div>
            <div className='flex flex-col'>
                <div className='text-richblack-5 flex flex-row text-lg gap-x-2 font-semibold'>
                <FaGlobeAsia className='text-richblack-5'/> 
                <p>Visit on us</p>
                </div>
                <p className='text-richblack-200 ml-3'>Come and say hello at our office HQ.</p>
                <p className='text-richblack-200 ml-3'>Rupa ki Nangal, Post-Sumel, Via, Jamdoli, Jaipur, Rajasthan 302031</p>
            </div>
            <div className='flex flex-col'>
                <div className='text-richblack-5 flex flex-row text-lg gap-x-2 font-semibold'>
                <MdPhone className='text-richblack-5'/> 
                <p>Call Us</p>
                </div>
                <p className='text-richblack-200 ml-3'>Mon - Fri From 8am to 5pm</p>
                <p className='text-richblack-200 ml-3'>+123 456 7890</p>
            </div>
        </div>
        {/* Contact Form */}
        <div className='border-2 border-richblack-600 p-10 rounded-lg'>
            <p className='text-richblack-5 text-3xl font-semibold '>Got a Idea? We’ve got the skills.</p>
            <p className='text-richblack-5 text-3xl font-semibold '>Let's team up</p>
            <p className='text-richblack-400 mt-2'>Tell us more about yourself and what you have got in mind.</p>
            <ContactUsForm/>
        </div>

    </div>
  )
}

export default ContactUs