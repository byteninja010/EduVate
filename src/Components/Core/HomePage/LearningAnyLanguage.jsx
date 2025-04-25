import React from "react";
import HighlightedText from "./HighlightedText";
import KnowYourProgress from "../../../assets/Images/Know_your_progress.png"
import compareWithOthers from "../../../assets/Images/Compare_with_others.png"
import planYourLessons from "../../../assets/Images/Plan_your_lessons.png"
import YBbutton from "./YBbutton";
const LearningAnyLanguage = () => {
  return (
    <div className="mt-36">
      <div className="flex flex-col gap-5">
        <div className="text-4xl font-semibold text-center">
          Your swiss knife for{" "}
          <HighlightedText text={"learning any langauge"} />
        </div>
        <div className="text-center text-richblack-600 mx-auto font-medium w-[60%]">
       Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more.
        </div>

      </div>
      <div className="flex lg:flex-row items-center flex-col">
        <img src={KnowYourProgress} alt="Know Your Progress" className="object-contain lg:-mr-32" />
        <img src={compareWithOthers} alt="Compare With Others" className="object-contain" />
        <img src={planYourLessons} alt="Plan Your lessons" className="object-contain lg:-ml-36" />
      </div>
      <div className="flex items-center justify-center mt-7 mb-32"> 
        <YBbutton active={true} linkTo={"/signup"}>Learn More</YBbutton>
      </div>
    </div>
  );
};

export default LearningAnyLanguage;
