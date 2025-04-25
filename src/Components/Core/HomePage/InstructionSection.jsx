import Instructor from "../../../assets/Images/Instructor.png";
import React from "react";
import HighlightedText from "./HighlightedText";
import YBbutton from "./YBbutton";
import { FaArrowRight } from "react-icons/fa";
const InstructionSection = () => {
  return (
    <div className="flex lg:flex-row flex-col mt-20 justify-between items-center">
      <div className="mb-10">
        <img
          src={Instructor}
          alt="Instructor"
          className="shadow-[-20px_-20px] shadow-white"
        />
      </div>
      <div className="lg:w-[45%] flex flex-col gap-5 items-center">
        <div className="font-semibold text-4xl text-white">
          Become an <HighlightedText text={"Instructor"} />
        </div>
        <div className="text-richblack-200">
          Instructors from around the world teach millions of students on
          StudyNotion. We provide the tools and skills to teach what you love.
        </div>
        <div>
          <YBbutton active={true} linkTo={"/signup"}>
            {" "}
            <div className="flex flex-row gap-2 items-center">
              Start Teaching Today <FaArrowRight />
            </div>
          </YBbutton>
        </div>
      </div>
    </div>
  );
};

export default InstructionSection;
