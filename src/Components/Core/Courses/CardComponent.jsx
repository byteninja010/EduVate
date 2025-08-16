import React from 'react'
import { Link } from 'react-router-dom'
import RatingStars from '../../Common/RatingStars'

const CardComponent = ({course}) => {
  return (
    <Link to={`/course/${course._id}`}>  
      <div className='w-full bg-richblack-800 rounded-xl p-4 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-25/20 border border-richblack-700 hover:border-yellow-25/50 group'>
        <div className='relative overflow-hidden rounded-lg'>
          <img 
            src={course.thumbnail} 
            alt={course.courseName} 
            className='w-full h-48 object-cover rounded-lg group-hover:scale-110 transition-transform duration-300'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-richblack-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
        </div>
        <div className='mt-4 space-y-2'>
          <h3 className='text-lg font-semibold text-richblack-5 line-clamp-2 group-hover:text-yellow-25 transition-colors duration-200'>
            {course.courseName}
          </h3>
                            <p className='text-richblack-300 text-sm line-clamp-2'>
                    {course.courseDescription}
                  </p>
                  
                  {/* Rating Display */}
                  {course.averageRating > 0 && (
                    <div className='flex items-center gap-2 pt-2'>
                      <RatingStars Review_Count={course.averageRating} Star_Size={16} />
                      <span className='text-sm text-richblack-400'>
                        ({course.ratingAndReviews?.length || 0})
                      </span>
                    </div>
                  )}
                  
                  <div className='flex items-center justify-between pt-2'>
                    <p className='text-yellow-25 text-xl font-bold'>₹{course.price}</p>
                    <div className='text-richblack-400 text-sm'>
                      {course.courseContent?.length || 0} sections
                    </div>
                  </div>
        </div>
      </div>
    </Link>
  )
}

export default CardComponent