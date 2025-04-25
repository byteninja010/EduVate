import React from "react";
import HighlightedText from "../Components/Core/HomePage/HighlightedText";
import img1 from "../assets/Images/aboutus1.webp"
import img2 from "../assets/Images/aboutus2.webp"
import img3 from "../assets/Images/aboutus3.webp"
import LearningGrid from "../Components/Core/AboutUs/LearningGrid";
import StatsComponenet from "../Components/Core/AboutUs/Stats";
const About = () => {
  return (
    <div>
  <section className="bg-richblack-700">
        <div className="relative mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-center text-white">
          <header className="mx-auto py-20 text-4xl font-semibold lg:w-[70%]">
            Driving Innovation in Online Education for a 
            <HighlightedText text={" Brighter Future"} />
            <p className="mx-auto mt-3 text-center text-base font-medium text-richblack-300 lg:w-[95%]">
              Studynotion is at the forefront of driving innovation in online
              education. We're passionate about creating a brighter future by
              offering cutting-edge courses, leveraging emerging technologies,
              and nurturing a vibrant learning community.
            </p>
          </header>
          <div className="sm:h-[70px] lg:h-[150px]"></div>
          <div className="absolute bottom-0 left-[50%] grid w-[100%] translate-x-[-50%] translate-y-[30%] grid-cols-3 gap-3 lg:gap-5">
            <img src={img1} alt="" />
            <img src={img2} alt="" />
            <img src={img3} alt="" />
          </div>
        </div>
      </section>
      <section className="w-10/12 mx-auto">
        <div className="text-2xl lg:text-4xl text-richblack-5 mt-20 lg:mt-32">
        We are passionate about revolutionizing the way we learn. Our innovative platform <HighlightedText text={"combines technology,"}/> expertise, and community to create an unparalleled educational experience
        </div>
      </section>
      <div className="my-10">
      <StatsComponenet/>
      </div>
     
      <section className="w-10/12 mx-auto">
      <LearningGrid/>
      </section>


</div>

  );
};

export default About;
