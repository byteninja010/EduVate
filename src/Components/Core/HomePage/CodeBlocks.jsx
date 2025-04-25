import React from "react";
import YBbutton from "./YBbutton";
import { TypeAnimation } from 'react-type-animation';
const CodeBlocks = ({codeText,heading,subHeading,btn1,btn2,codeColor,reverse}) => {
  return (
    <div className={`mt-16 flex ${reverse ? "lg:flex-row-reverse" : "lg:flex-row"} justify-between w-[90%] mx-auto flex-col`}>
      <div className="w-[100%] lg:w-[45%] flex flex-col gap-4">
       {heading}
        <div className="text-richblack-200">
      {subHeading}
        </div>
        <div className="mt-7 flex flex-row gap-4">
            <YBbutton active={btn1.active} linkTo={btn1.link}>
               {btn1.btnText}</YBbutton>
               <YBbutton active={btn2.active} linkTo={btn2.link}>
               {btn2.btnText}</YBbutton>
        </div>
      </div>
      <div className="w-[100%] lg:w-[470px] h-fit flex flex-row border-2 border-richblack-700 p-4 font-mono font-semibold">
        <div className="w-[10%] flex flex-col text-richblack-200">
            <p>1</p>
            <p>2</p>
            <p>3</p>
            <p>4</p>
            <p>5</p>
            <p>6</p>
            <p>7</p>
            <p>8</p>
            <p>9</p>
            <p>10</p>
            <p>11</p>

        </div>
        <div className={`w-[90%] flex flex-row ${codeColor}`}>
        <TypeAnimation 
            sequence={[codeText,5000,'']}
             style={{whiteSpace:'pre-line',display:'block'}}
            repeat={Infinity}
            omitDeletionAnimation={true}
        />
        </div>


      </div>
    </div>
  );
};

export default CodeBlocks;
