import React from 'react'
import { Link } from 'react-router-dom'

const CardComponent = ({course}) => {
  return (
    <Link to={`/course/${course._id}`}>  
    <div className='w-[28%] mt-5 p-3 hover:scale-95 transition-all duration-200'>
    <div><img src={course.thumbnail} alt="" className='object-cover rounded-2xl'/></div>
    <div className='flex flex-col mt-4'>
      <p className='text-xl text-richblack-5'>{course.courseName}</p>
      <p className='text-richblack-100'>{course.courseDescription}</p>
      <p className='text-yellow-100 text-lg'>₹{course.price}</p>
    </div>
    </div>
    </Link>
  )
}

export default CardComponent