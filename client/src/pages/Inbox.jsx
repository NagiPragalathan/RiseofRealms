import React from 'react'
import { messages } from '../constant';
import top from "../assets/images/top.png";
import bottom from "../assets/images/bottom.png";

const Inbox = () => {
  return (
    <div className="bg-black w-full  h-screen p-2  sm:p-10 lg:px-60  relative flex flex-col items-center overflow-y-scroll">
      <div className="pb-10">
        <h1 className="text-center text-white font-semibold text-2xl">
          Inbox
        </h1>
      </div>
      
      <div className="w-full  bg-[#ffffff12] z-50 rounded-xl py-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="flex justify-between items-center py-3  border-b-[1px] border-[#f6f6f629] hover:bg-[#ffffff15] cursor-pointer px-2 lg:px-10"
          >
            <div className="flex items-center ">
              <div className="font-semibold text-[#ffffff66]">{msg.name}</div>
              <span className="mx-2 text-gray-500">-</span>
              <div className="text-white">{msg.message}</div>
            </div>
            <div className="text-sm text-gray-400">{msg.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Inbox
