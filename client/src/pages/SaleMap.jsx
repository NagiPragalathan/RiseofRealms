import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import top from "../assets/images/top.png";
import bottom from "../assets/images/bottom.png";
import AI from "../assets/images/AI.jpg";


const SaleMap = () => {
 
  const navigate = useNavigate(); // Hook to navigate to different routes



  return (
    <div className="bg-black w-full min-h-screen p-10 px-16 overflow-y-scroll relative flex flex-col justify-center items-center">
      <img
        src={top}
        alt=""
        className="fixed -top-10 left-0 h-[20rem] md:h-[40rem] w-[20rem] md:w-[40rem] z-0"
      />
      <img
        src={bottom}
        alt=""
        className="fixed bottom-0 right-0 h-[20rem] md:h-[80rem] w-[20rem] md:w-[80rem] -z-0"
      />
      <div className="flex  md:flex-row justify-between w-full px-2 md:px-20 lg:px-32 py-2 gap-10 mx-auto items-center">
        <div
          className={`flex flex-col items-center bg-[#ffffff0b] rounded-lg z-50   p-1 lg:p-3 border-[1px] border-[#f6f6f667] hover:border-[2px] `}
          style={{ width: "70%", maxWidth: "400px" }}
        >
          <img
            src={AI}
            alt=""
            className="w-full md:max-h-[250px] max-h-[200px] rounded-lg "
          />
        </div>
        <div
          className="  rounded-lg bg-[#ffffff0b] z-50 items-center justify-center flex flex-col gap-4 p-2"
          style={{ width: "70%", maxWidth: "400px" }}
        >
          <div className="w-full h-fit">
            <h1 className="text-white font-medium lg:text-3xl text-center">
              Block Name
            </h1>
            <h1 className="text-white font-medium lg:text-3xl text-center">
              No of blocks
            </h1>
          </div>
        </div>
      </div>

      <button
        className={`bg-[#8689EB] hover:bg-[#8689eb94] text-white font-medium text-base px-6 py-2 rounded-xl w-fit cursor-pointer z-50 mx-auto mt-6 lg:mt-11 `}
      >
        Sale
      </button>
    </div>
  );
};

export default SaleMap;
