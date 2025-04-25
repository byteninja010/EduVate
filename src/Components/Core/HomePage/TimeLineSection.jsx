import React from "react";
import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg";
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg";
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg";
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg";
import TimeLineImage from "../../../assets/Images/TimelineImage.png";

export const TimeLineData = [
  {
    logo: Logo1,
    title: "Leadership",
    description: "Fully committed to the success company",
  },
  {
    logo: Logo2,
    title: "Responsibility",
    description: "Students will always be our top priority",
  },
  {
    logo: Logo3,
    title: "Flexibility",
    description: "The ability to switch is an important skill",
  },
  {
    logo: Logo4,
    title: "Solve the problem",
    description: "Code your way to a solution",
  },
];

const TimeLineSection = () => {
  return (
    <div className="relative">
      <div className="flex flex-col lg:flex-row justify-between items-center ">
        <div className="mt-10">
          {TimeLineData.map((ele, index) => {
            return (
              <div className="flex flex-col" key={index}>
                <div className="flex flex-row gap-6">
                  <div className="w-[50px] h-[50px] bg-white rounded-full flex items-center justify-center shadow-md">
                    <img src={ele.logo} alt="" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">{ele.title}</p>
                    <p>{ele.description}</p>
                  </div>
                </div>
                <div
                  className={`${
                    index === TimeLineData.length - 1 ? "hidden" : ""
                  }h-[40px] border-l-2 flex items-center justify-center border-richblack-100 border-dashed ml-6`}
                ></div>
              </div>
            );
          })}
        </div>
        <div className="mt-16 shadow-[10px_-5px_50px_-5px] shadow-blue-200">
          <img src={TimeLineImage} alt="Girl Reading a book" />
          <div className="absolute bg-caribbeangreen-700 lg:flex flex-row text-white uppercase py-10 lg:left-[50%] bottom-[-5%] hidden">
            <div className="flex flex-row items-center gap-5 border-r border-caribbeangreen-500 px-7">
              <p className="text-3xl font-semibold">10</p>
              <p className="text-caribbeangreen-300">Years Experience</p>
            </div>
            <div className="flex flex-row items-center gap-5 px-7">
            <p className="text-3xl font-semibold">250</p>
            <p className="text-caribbeangreen-300">Types Of Courses</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeLineSection;
