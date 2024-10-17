import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import top from "../assets/images/top.png";
import bottom from "../assets/images/bottom.png";
import playmap from "../assets/images/playmap.jpg";
import mapdet from "../assets/images/mapdet.jpg";

const SelectMode = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const navigate = useNavigate(); // Hook to navigate to different routes

  const handlePlayClick = (option) => {
    if (option === "mapdetails") {
      navigate("/salemap"); // Replace with the desired route for AI game
    } else if (option === "playmap") {
      navigate("/build/freestyle"); // Replace with the desired route for World game
    }
  };

  return (
    <div className="bg-black w-full  min-h-screen p-10 px-16  relative flex flex-col justify-center items-center">
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
      <div className="flex  md:flex-row justify-between w-full px-2 md:px-32 py-2 gap-5 mx-auto items-center">
        <div
          className={`flex flex-col items-center bg-[#ffffff16] rounded-lg z-50 cursor-pointer p-1 sm:p-3  border-[1px] border-[#f6f6f667] hover:border-[2px] ${
            selectedOption === "mapdetails" ? "border-[#8689EB]" : ""
          }`}
          onClick={() => {
            setSelectedOption("mapdetails");
            handlePlayClick("mapdetails");
          }}
          style={{ width: "70%", maxWidth: "400px" }}
        >
          <img
            src={mapdet}
            alt="mapdetails"
            className="w-full md:max-h-[250px] max-h-[200px] rounded-lg"
          />
          <h1 className="text-[#ffffffaa] text-base lg:text-3xl  font-medium lg:font-semibold pt-5">
            Map Details
          </h1>
        </div>
        <div
          className={`flex flex-col items-center bg-[#ffffff16] rounded-lg z-50 cursor-pointer p-1 sm:p-3 border-[1px] border-[#f6f6f667] hover:border-[2px] ${
            selectedOption === "playmap" ? "border-[#8689EB]" : ""
          }`}
          onClick={() => {
            setSelectedOption("playmap");
            handlePlayClick("playmap");
          }}
          style={{ width: "70%", maxWidth: "400px" }}
        >
          <img
            src={playmap}
            alt="World Mode"
            className="w-full md:max-h-[250px] max-h-[200px] rounded-lg"
          />
          <h1 className="text-[#ffffffaa] text-base lg:text-3xl  font-medium lg:font-semibold pt-5">
            Play Map
          </h1>
        </div>
      </div>
    </div>
  );
};

export default SelectMode;
