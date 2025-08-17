import React from 'react' 
import { useSelector } from 'react-redux'
import { getEnrolledCourse } from '../../../services/operations/Settings'
import { useState,useEffect } from 'react';
import ProgressBar from "@ramonak/react-progress-bar"
import { useNavigate } from 'react-router-dom';
import { HiOutlinePlay } from 'react-icons/hi';
const EnrolledCourse = () => {  
  const token=useSelector((state)=>state.auth.token);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data,setData]=useState(null); 
  const fetchdata=async ()=>{
    try{
      const response=await getEnrolledCourse(token);
      setData(response?.data?.data);
      setLoading(false);
    }catch(err){
      console.log(err);
    }
  }
 /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
  fetchdata();
  }, []);
/* eslint-enable react-hooks/exhaustive-deps */
  return (
    <div>
      <h1 className='text-richblack-5 text-2xl sm:text-3xl mb-4 sm:mb-6'>Enrolled Course</h1>
        {loading?<div className='spinner mx-auto flex justify-center items-center'></div>:<div>
          {data.length===0 ? <div className="text-center py-8 text-richblack-200">You have not enrolled in any Course</div>:
          <div className='border-[1px] border-richblack-200 rounded-xl mt-3 sm:mt-5 overflow-hidden'>
            {/* Desktop Table Header */}
            <div className='bg-richblack-500 text-richblack-100 text-xs sm:text-sm flex flex-row p-2 sm:p-3 justify-between rounded-t-xl hidden sm:flex'>
              <p className='w-[50%]'>Course Name</p>
              <p className='w-[10%]'>Duration</p>
              <p className='w-[30%]'>Progress</p>
              <p className='w-[10%] text-center'>Action</p>
            </div>
            {
              data.map((item,index)=>{
                return (
                  <div key={item._id} className={`flex flex-col sm:flex-row text-richblack-5 items-start sm:items-center gap-3 sm:gap-0 mt-0 sm:mt-4 ${index<data.length-1 ? "border-b-[1px] border-richblack-200":""} p-3 sm:justify-between`}>
                    <div className='flex flex-row gap-3 sm:gap-6 w-full sm:w-[50%]'> 
                      <img src={item.thumbnail} alt="" width={"60px"} className='object-cover aspect-square w-16 h-16 sm:w-[60px] flex-shrink-0'/>
                      <div className="flex-1 min-w-0">
                        <p className='font-semibold text-sm sm:text-base line-clamp-1'>{item.courseName}</p>
                        <p className='text-richblack-100 text-xs sm:text-sm mt-1 line-clamp-2'>{item.courseDescription>50?item.courseDescription.slice(0,50)+"...":item.courseDescription}</p>
                      </div>
                    </div>
                    <div className='w-full sm:w-[10%] text-richblack-50 text-xs sm:text-sm'>
                      <span className="sm:hidden text-richblack-300 text-xs font-medium">Duration: </span>
                      {item.totalDuration}
                    </div>
                    <div className='w-full sm:w-[30%] flex flex-col gap-y-2'>
                      <p className='text-richblack-50 text-xs sm:text-sm'>{`Progress: ${item.progressPercentage}%`} </p>
                      <ProgressBar completed={item.progressPercentage} height='12px' isLabelVisible={false} baseBgColor='#2C333F' bgColor='#47A5C5'/>
                    </div>
                    
                    {/* Continue Learning Button */}
                    <div className='w-full sm:w-[10%] flex justify-start sm:justify-center'>
                      <button
                        onClick={() => navigate(`/enrolled-course/${item._id}`)}
                        className='flex items-center gap-2 px-3 py-2 bg-yellow-25 text-richblack-900 rounded-md hover:bg-yellow-50 transition-colors text-xs sm:text-sm font-medium'
                      >
                        <HiOutlinePlay className="text-xs sm:text-sm" />
                        <span className="hidden sm:inline">Continue</span>
                        <span className="sm:hidden">Learn</span>
                      </button>
                    </div>
                  </div>
                )
              })
            }
            
        </div>}
          </div>}
    </div>
  )
}

export default EnrolledCourse