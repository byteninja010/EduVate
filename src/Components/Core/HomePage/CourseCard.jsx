import React from "react";
import { ImTree } from "react-icons/im";
import { MdPeople } from "react-icons/md";
const CourseCard = ({ data, currentCard, setCurrentCard }) => {
  const cardClick=(ele)=>{
    setCurrentCard(ele);
  }
  return (
    <div className={`lg:w-[27%] h-[300px] mt-8 ${currentCard===data ? "bg-white shadow-[20px_20px] shadow-yellow-50 ":"bg-richblack-800"} cursor-pointer hover:scale-95 transition-all duration-200 rounded-lg`} onClick={()=>cardClick(data)}>
      <div className="h-[75%]">
        <div className={`text-xl ${currentCard===data ? "text-richblack-800":"text-richblack-25"}  font-bold mt-5 w-[80%] mx-auto`}>
          {data.heading}
        </div>
        <div className="text-richblack-400 w-[80%] mx-auto mt-4">
          {data.description}
        </div>
      </div>
      <div className="border-t-2 border-dashed border-richblack-400"></div>
      <div className={`flex flex-row gap-20 items-center h-[15%] ${currentCard===data ? "text-blue-500":"text-richblack-200"}`}>
        <div className="flex flex-row gap-2 ml-4">
        <MdPeople className="text-2xl"/>
        <p>{data.level}</p>
        </div>
        <div className="flex flex-row gap-2">
            <ImTree className="text-2xl"/>
            <p>{data.lessionNumber} Lessons</p>
        </div>
        
      </div>
    </div>
  );
};

export default CourseCard;
