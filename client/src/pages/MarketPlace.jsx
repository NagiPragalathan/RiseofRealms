import React from "react";
import { MarketOption } from "../constant";
import top from "../assets/images/top.png";
import bottom from "../assets/images/bottom.png";
import { FaLocationDot } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const MarketPlace = () => {
  const navigate = useNavigate();

  const handleInboxClick = () => {
    navigate("/inbox");
  };

  const handleLocationClick = () => {
    navigate("/selectmap");
  };
  const handleCardClick = () => {
    navigate("/selectmode");
  };

  return (
    <div className="bg-black w-full h-screen p-10 px-16 relative overflow-hidden">
      <div className="pb-10">
        <h1 className="text-center text-white font-semibold text-2xl">
          Marketplace
        </h1>
        <button
          onClick={handleInboxClick}
          className="bg-[#8689EB] hover:bg-[#8689eb94] text-white font-medium text-base px-4 py-2 rounded-xl w-fit fixed cursor-pointer z-50 right-5 -mt-6  top-16 "
        >
          Inbox
        </button>
      </div>
      <button
        onClick={handleLocationClick}
        className="bg-[#FF0000] text-white font-medium text-xl px-3 py-3 rounded-full w-fit bottom-0 right-0 m-3 fixed cursor-pointer z-50"
      >
        <FaLocationDot />
      </button>
      {/* Set background images as fixed */}
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
      {/* Wrapping content div to allow scrolling */}
      <div className="h-[calc(100vh-150px)] overflow-y-scroll flex flex-wrap justify-between gap-3 z-50 mx-auto items-center">
        {MarketOption.map((markets) => (
          <div
            key={markets.id}
            className="flex flex-col gap-5 p-3 bg-[#ffffff18] rounded-lg z-50 cursor-pointer mx-auto"
            onClick={handleCardClick}
          >
            <img
              src={markets.image}
              alt=""
              className="h-[200px] w-[300px] rounded-lg "
            />
            <div className="flex justify-between px-2">
              <h1 className="text-[#ffffffaa] text-lg font-medium">
                {markets.name}
              </h1>
              <h1 className="text-[#ffffffaa] text-lg font-medium">
                {markets.price}
              </h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketPlace;
