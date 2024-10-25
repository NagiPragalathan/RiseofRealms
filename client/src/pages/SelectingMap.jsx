import React from "react";
import {SelectMap}  from "../constant";
import top from "../assets/images/top.png";
import bottom from "../assets/images/bottom.png";
import { useNavigate } from "react-router-dom";


const SelectingMap = () => {
  const navigate = useNavigate();
  const handleSelectClick = () => {
    navigate("/salemap");
  };
  return (
    <div className="bg-black w-full h-screen p-10 px-16 overflow-y-scroll relative">
      <div className="pb-10">
        <h1 className="text-center text-white font-semibold text-2xl">
          Choose the map
        </h1>
      </div>

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
      <div className="h-[calc(100vh-150px)] overflow-y-scroll flex flex-wrap justify-between gap-3 z-50 mx-auto items-center">
        {SelectMap.map((Select) => (
          <div
            key={Select.id}
            className="flex flex-col gap-5 p-3 bg-[#ffffff09] rounded-lg z-50 cursor-pointer border-[1px] border-[#f6f6f629] hover:border-[2px] mx-auto"
          >
            <img
              src={Select.image}
              alt=""
              className="h-[200px] w-[300px] rounded-lg "
            />
            <div className="flex  justify-between px-2">
              <h1 className="text-[#ffffffd7] text-lg font-medium">
                {Select.name}
              </h1>
              <button className="bg-green-900 text-white font-medium text-base px-6 py-2 rounded-xl w-fit float-right cursor-pointer z-50 hover:bg-green-700"
              onClick={handleSelectClick}>
                Select
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectingMap;
