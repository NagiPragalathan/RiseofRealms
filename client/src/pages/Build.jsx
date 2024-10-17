import React from "react";
import { Buildoptions } from "../constant";
import { Link } from "react-router-dom";
import top from "../assets/images/top.png";
import bottom from "../assets/images/bottom.png";

const Build = () => {
  return (
    <div className="bg-black min-h-screen w-full flex flex-col items-center justify-center md:p-20 py-4 px-10 relative overflow-y-auto">
      {/* Background images with fixed position */}
      <img
        src={top}
        alt=""
        className="fixed -top-10 left-0 h-[40rem] w-[40rem] z-0"
      />
      <img
        src={bottom}
        alt=""
        className="fixed bottom-0 right-0 h-[80rem] w-[80rem] -z-0"
      />
      {/* Updated button to be fixed at the top-left corner */}
      <button className="bg-[#8689EB] text-white font-medium text-lg px-6 py-2 rounded-xl w-fit fixed top-4 left-4 z-50">
        <Link to="/">Exit</Link>
      </button>
      <div className="flex flex-wrap justify-between w-full items-center z-50 gap-6">
        {Buildoptions.map((option) => (
          <div
            key={option.id}
            className="flex flex-col gap-6 border-[1px] border-[#f6f6f667] p-2 md:p-4 rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105 w-[30%] md:w-[30%] lg:w-[25%] xl:w-[30%]"
          >
            <Link to={option.link}>
              <img src={option.image} alt="" className="w-full rounded-lg" />
              <h1 className="text-white text-center text-lg lg:text-2xl font-medium lg:font-semibold py-2">
                {option.head}
              </h1>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Build;
