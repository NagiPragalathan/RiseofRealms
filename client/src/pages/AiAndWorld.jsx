import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import top from "../assets/images/top.png";
import bottom from "../assets/images/bottom.png";
import AI from "../assets/images/AI.jpg";
import World from "../assets/images/World.jpg";

const AiAndWorld = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const navigate = useNavigate();

  const handlePlayClick = () => {
    if (selectedOption === "AI") {
      navigate("/ai-game");
    } else if (selectedOption === "World") {
      navigate("/world-game");
    }
  };

  return (
    <div className="bg-black w-full min-h-screen p-4 md:p-10 overflow-y-scroll relative flex flex-col items-center justify-center">
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
          className={`flex flex-col items-center bg-[#ffffff0b] rounded-lg z-50 cursor-pointer p-3 border-[1px] border-[#f6f6f667] hover:border-[2px] ${
            selectedOption === "AI" ? "border-[#8689EB]" : ""
          }`}
          onClick={() => setSelectedOption("AI")}
          style={{ width: "45%", maxWidth: "400px" }} // Adjust width to be percentage-based
        >
          <img
            src={AI}
            alt=""
            className="w-full md:max-h-[250px] max-h-[200px] rounded-lg" // Use w-full for responsive image width
          />
          <h1 className="text-[#ffffffaa] text-2xl md:text-3xl font-semibold pt-3 md:pt-5">
            AI
          </h1>
        </div>
        <div
          className={`flex flex-col items-center bg-[#ffffff0b] rounded-lg z-50 cursor-pointer p-3 border-[1px] border-[#f6f6f667] hover:border-[2px] ${
            selectedOption === "World" ? "border-[#8689EB]" : ""
          }`}
          onClick={() => setSelectedOption("World")}
          style={{ width: "45%", maxWidth: "400px" }} // Adjust width to be percentage-based
        >
          <img
            src={World}
            alt=""
            className="w-full md:max-h-[250px] max-h-[200px] rounded-lg" // Use w-full for responsive image width
          />
          <h1 className="text-[#ffffffaa] text-2xl md:text-3xl font-semibold pt-3 md:pt-5">
            WORLD
          </h1>
        </div>
      </div>

      <button
        onClick={handlePlayClick}
        className={`bg-[#8689EB] hover:bg-[#8689eb94] text-white font-medium text-base px-6 py-2 rounded-xl w-fit cursor-pointer z-50 mx-auto mt-2 lg:mt-11 ${
          !selectedOption ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={!selectedOption}
      >
        Play
      </button>
    </div>
  );
};

export default AiAndWorld;
