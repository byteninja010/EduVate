import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import HighlightedText from "../Components/Core/HomePage/HighlightedText";
import YBbutton from "../Components/Core/HomePage/YBbutton";
import Banner from "../assets/Images/banner.mp4";
import CodeBlocks from "../Components/Core/HomePage/CodeBlocks";
import ExploreMore from "../Components/Core/HomePage/ExploreMore";
import LearningAnyLanguage from "../Components/Core/HomePage/LearningAnyLanguage";
import TimeLineSection from "../Components/Core/HomePage/TimeLineSection";
import InstructionSection from "../Components/Core/HomePage/InstructionSection";
const Home = () => {
  return (
    <div>
     
      {/*Section 1*/}
      <div className="relative text-white mx-auto flex flex-col w-11/12 max-w-maxContent items-center justify-between">
        <Link to={"signup"}>
          <div
            className="mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 
           hover:scale-95 w-fit group"
          >
            <div className="flex flex-row items-center rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900">
              <p>Become an instructor</p>
              <FaArrowRight />
            </div>
          </div>
        </Link>
        <div className="text-center text-4xl font-semibold mt-7">
          Empower Your Future with <HighlightedText text={"Coding Skills"} />
        </div>
        <div className="w-7/12 text-center text-richblack-300 mt-3 font-inter font-medium">
          With our online coding courses, you can learn at your own pace, from
          anywhere in the world, and get access to a wealth of resources,
          including hands-on projects, quizzes, and personalized feedback from
          instructors.
        </div>
        <div className="flex flex-row gap-7 mt-7 font-medium">
          <YBbutton active={true} linkTo={"/signup"}>
            Learn More
          </YBbutton>
          <YBbutton active={false} linkTo={"/bookADemo"}>
            Book A Demo
          </YBbutton>
        </div>
        
        {/* Browse Catalog Button */}
        <div className="mt-8">
          <Link to="/catalog">
            <button className="bg-yellow-25 text-richblack-900 px-8 py-4 rounded-lg font-semibold hover:bg-yellow-50 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center gap-3 mx-auto">
              <span>Browse Course Catalog</span>
              <FaArrowRight />
            </button>
          </Link>
        </div>

        <div className="shadow-[10px_-5px_50px_-5px] shadow-blue-200 mt-16">
          <video
            src={Banner}
            muted
            loop
            autoPlay
            className="shadow-[20px_20px_rgba(255,255,255)]"
          ></video>
        </div>
        <div>
          <CodeBlocks
            codeText={`<!DOCTYPE html>\n<html>\n<head>\n<title>\nExample\n</title>\n<link rel="stylesheet" href="styles.css">\n</head>\n<body>\n<h1>Hello</h1>\n<body>`}
            heading={
              <div className="text-4xl">
                Unlock your <HighlightedText text={"coding potential"} /> with
                our online courses.
              </div>
            }
            subHeading={
              "  Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
            }
            btn1={{
              btnText: (
                <div className="flex flex-row gap-2 items-center">
                  Try it yourself <FaArrowRight />
                </div>
              ),
              linkTo: "/signup",
              active: true,
            }}
            btn2={{
              btnText: "Learn More",
              linkTo: "/signup",
              active: false,
            }}
            codeColor={"text-yellow-100"}
            reverse={false}
          />
        </div>
        <div>
          {/*2nd Block */}
          <CodeBlocks
            codeText={`<!DOCTYPE html>\n<html>\n<head>\n<title>\nExample\n</title>\n<link rel="stylesheet" href="styles.css">\n</head>\n<body>\n<h1>Hello</h1>\n<body>`}
            heading={
              <div className="text-4xl w-[50%]">
                Start <HighlightedText text={"coding in seconds"} />
              </div>
            }
            subHeading={
              "  Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
            }
            btn1={{
              btnText: (
                <div className="flex flex-row gap-2 items-center">
                  Continue Lesson <FaArrowRight />
                </div>
              ),
              linkTo: "/signup",
              active: true,
            }}
            btn2={{
              btnText: "Learn More",
              linkTo: "/signup",
              active: false,
            }}
            codeColor={"text-richblack-200"}
            reverse={true}
          />
        </div>
        <ExploreMore />
      </div>
      {/* Section2 */}
      <div className="bg-pure-greys-5 text-richblack-700">
        <div className="flex homepage_bg h-[300px]">
          <div className="flex flex-row w-11/12 mx-auto items-center justify-center mt-10 gap-4">
            <YBbutton linkTo={"/signup"} active={true}>
              <div className="flex flex-row gap-2 items-center">
                Explore Full Catalog <FaArrowRight />
              </div>
            </YBbutton>
            <YBbutton linkTo={"/signup"} active={false}>
              Learn More
            </YBbutton>
          </div>
        </div>
        <div className="flex w-11/12 max-w-maxContent flex-col mx-auto mt-16">
          <div className="lg:flex flex-row gap-10 ">
            <div className="text-4xl font-semibold lg:w-[50%]">
              Get the skills you need for the{" "}
              <HighlightedText text={"job that is in demand"} />
            </div>
            <div className="lg:w-[45%] font-semibold flex flex-col gap-5 ">
              <p>
                The modern StudyNotion is the dictates its own terms. Today, to
                be a competitive specialist requires more than professional
                skills.
              </p>
              <YBbutton link={"/signup"} active={true}>
                Learn More
              </YBbutton>
            </div>
          </div>
          <TimeLineSection />
          <LearningAnyLanguage />
        </div>
      </div>
      {/* Section3 */}
      <div className="w-11/12 max-w-maxContent mx-auto">
      <InstructionSection/>
      </div>
    
        
    </div>
  );
};

export default Home;
