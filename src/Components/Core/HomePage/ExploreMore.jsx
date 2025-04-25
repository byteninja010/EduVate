import React, { useState } from "react";
import HighlightedText from "./HighlightedText";
import { HomePageExplore } from "../../../data/homepage-explore";
import CourseCard from "./CourseCard";
const tabsName = HomePageExplore.map((item) => item.tag);
// Function to update the value of the current tab and data according to that
const ExploreMore = () => {
  const [currentTab, setCurrentTab] = useState(tabsName[0]);
  const [courses, setCourses] = useState(HomePageExplore[0].courses);
  const [currentCard, setCurrentCard] = useState(HomePageExplore[0].courses[0]);
  const setMyCards = (ele) => {
    setCurrentTab(ele);
    const result = HomePageExplore.filter((course) => course.tag === ele);
    setCourses(result[0].courses);
    setCurrentCard(result[0].courses[0]);
  };

  return (
    <div className="w-[100%]">
      <div>
        <div className="text-center text-white text-4xl mt-20">
          Unlock the <HighlightedText text={"Power of code"} />
        </div>
        <div className="text-center text-richblack-200 mt-2">
          Learn to Build Anything You Can Imagine
        </div>
      </div>
      {/* Nav-Bar Code */}
      <div className="hidden lg:flex flex-row rounded-full bg-richblack-800 gap-2 mt-5 w-[45%] mx-auto">
        {tabsName.map((element, index) => {
          return (
            <div
              className={`text-[16px] flex flex-row items-center gap-2
                    ${
                      currentTab === element
                        ? "bg-richblack-900 text-richblack-5 font-medium"
                        : "text-richblack-200"
                    } 
                    rounded-full transition-all duration-200 cursor-pointer hover:bg-richblack-900 hover:text-richblack-5 p-3`}
              onClick={() => setMyCards(element)}
            key={index}
            >
              {element}
            </div>
          );
        })}
      </div>
      {/* Course Section */}
      <div className="lg:h-[250px] flex flex-col lg:flex-row justify-between w-[100%]">
        {
          courses.map((course,index)=>{
         return(
          <CourseCard key={index} data={course} currentCard={currentCard} setCurrentCard={setCurrentCard}/>
         )
          })
        }
      </div>
    </div>
  );
};

export default ExploreMore;
