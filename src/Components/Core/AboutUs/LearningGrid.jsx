import React from "react";
import { LearningGridArray } from "../../../data/LearningGrid";
import YBbutton from "../HomePage/YBbutton"
import HighlightedText from "../HomePage/HighlightedText";
const LearningGrid = () => {
  return (
    <div className="grid lg:grid-cols-4 grid-cols-1">
      {LearningGridArray.map((card, index) => {
        return (
            <div
            key={index}
            className={`${card.order===-1 && "lg:col-span-2"} ${
              card.order !== -1
                ? (card.order % 2 === 1 ? "bg-richblack-700" : "bg-richblack-800")
                : ""
            } ${card.order === 3 && "lg:col-start-2"} `}
          >
            {
                card.order<0 ? (
                    <div className="p-4 text-richblack-5">
                        <div className="text-3xl font-semibold">
                        {card.heading}
                        <HighlightedText text={card.highlightText}/>
                        </div>
                        <div className="my-3 text-richblack-300">
                            {card.description}
                        </div>
                        <YBbutton active={true} linkTo={card.BtnLink}>{card.BtnText}</YBbutton>
                    </div>
                ):(
                    <div className="p-8 flex flex-col h-[250px]">
                        <div className="text-lg text-richblack-5 ">
                            {card.heading}
                        </div>
                        <div className="mt-3 text-richblack-100 ">
                            {card.description}
                        </div>
                    </div>
                )
            }

          </div>
        );
      })}
    </div>
  );
};

export default LearningGrid;
