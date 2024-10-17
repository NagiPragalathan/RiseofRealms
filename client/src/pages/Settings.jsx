import React, { useState } from "react";
import { FaToggleOn, FaToggleOff, FaTimes } from "react-icons/fa"; // Import icons
import top from "../assets/images/top.png";
import bottom from "../assets/images/bottom.png";
import { FaTwitter, FaFacebook, FaInstagram } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  const [musicVolume, setMusicVolume] = useState(50);
  const [soundEffectsVolume, setSoundEffectsVolume] = useState(50);
  const [ambientSoundVolume, setAmbientSoundVolume] = useState(50);

  const [forwardMovement, setForwardMovement] = useState(true);
  const [leftMovement, setLeftMovement] = useState(true);
  const [backwardMovement, setBackwardMovement] = useState(true);
  const [rightMovement, setRightMovement] = useState(true);
  const [run, setRun] = useState(true);
  const [pickup, setPickup] = useState(true);
  const [web3Enabled, setWeb3Enabled] = useState(false); // New state for Web3 toggle
  const [notificationsEnabled, setNotificationsEnabled] = useState(false); // New state for Notification toggle
  const [selectedLanguage, setSelectedLanguage] = useState("English"); // New state for language selection
  const [selectedServer, setSelectedServer] = useState("US-East");

  const handleMusicChange = (e) => setMusicVolume(e.target.value);
  const handleSoundEffectsChange = (e) => setSoundEffectsVolume(e.target.value);
  const handleAmbientSoundChange = (e) => setAmbientSoundVolume(e.target.value);

  const toggleButton = (setter, value) => {
    setter(!value);
  };

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
  };
   const handleServerChange = (e) => {
     setSelectedServer(e.target.value);
   };


   const handleClose = () => {
     navigate("/"); // Navigate to the root path
   };

  return (
    <div className="bg-black  min-h-screen w-full flex flex-col items-center justify-center p-4 lg:p-20 relative overflow-y-scroll">
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
      <div className="w-full lg:w-3/4 rounded-lg bg-[#ffffff0b] border-[1px] border-[#f6f6f629] p-5 z-50 h-[calc(100vh-30px)] overflow-y-scroll">
        <button
          onClick={handleClose}
          className="absolute top-8 right-10 text-white hover:text-[#8689EB] rounded-full border-white border p-2 hover:border-[#8689EB] transition duration-200"
        >
          <FaTimes size={24} />
        </button>
        <div>
          <h1 className="text-center text-white font-semibold text-2xl">
            Settings
          </h1>
        </div>
        <div className="flex md:flex-row flex-col gap-20">
          <div className="mt-5 md:w-1/2">
            <div className="mb-5">
              <h1 className="text-white text-xl">Audio</h1>
              <div className="pl-7 p-4 flex flex-col gap-2">
                {/* Music Volume */}
                <div className="flex w-full justify-between items-center">
                  <label className="text-white mb-1">Music</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={musicVolume}
                    onChange={handleMusicChange}
                    className="w-1/2 h-2 bg-gray-700 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Sound Effects Volume */}
                <div className="flex w-full justify-between items-center">
                  <label className="text-white mb-1">Sound Effects</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={soundEffectsVolume}
                    onChange={handleSoundEffectsChange}
                    className="w-1/2 h-2 bg-gray-700 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Ambient Sound Volume */}
                <div className="flex w-full justify-between items-center">
                  <label className="text-white mb-1">Ambient Sound</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={ambientSoundVolume}
                    onChange={handleAmbientSoundChange}
                    className="w-1/2 h-2 bg-gray-700 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div>
              <h1 className="text-white text-xl">Controls</h1>
              <div className="pl-7 p-4 flex flex-col gap-2 w-full">
                {/* Example of Control Button */}
                <div className="flex items-center justify-between w-full">
                  <p className="text-white mb-1">Forward Movement</p>
                  <div className="flex gap-4 items-center">
                    <p className="text-white mb-1">W</p>
                    <button
                      onClick={() =>
                        toggleButton(setForwardMovement, forwardMovement)
                      }
                      className="text-white mb-1 text-sm border-2 border-[#8689EB] rounded-lg px-3 py-1"
                    >
                      {forwardMovement ? "Set" : "Reset"}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-white mb-1">Left Movement</p>
                  <div className="flex gap-4 items-center">
                    <p className="text-white mb-1">A</p>
                    <button
                      onClick={() =>
                        toggleButton(setLeftMovement, leftMovement)
                      }
                      className="text-white mb-1 text-sm border-2 border-[#8689EB] rounded-lg px-3 py-1"
                    >
                      {leftMovement ? "Set" : "Reset"}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-white mb-1">Backward Movement</p>
                  <div className="flex gap-4 items-center">
                    <p className="text-white mb-1">S</p>
                    <button
                      onClick={() =>
                        toggleButton(setBackwardMovement, backwardMovement)
                      }
                      className="text-white mb-1 text-sm border-2 border-[#8689EB] rounded-lg px-3 py-1"
                    >
                      {backwardMovement ? "Set" : "Reset"}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-white mb-1">Right Movement</p>
                  <div className="flex gap-4 items-center">
                    <p className="text-white mb-1">D</p>
                    <button
                      onClick={() =>
                        toggleButton(setRightMovement, rightMovement)
                      }
                      className="text-white mb-1 text-sm border-2 border-[#8689EB] rounded-lg px-3 py-1"
                    >
                      {rightMovement ? "Set" : "Reset"}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-white mb-1">Run</p>
                  <div className="flex gap-4 items-center">
                    <p className="text-white mb-1">Shift</p>
                    <button
                      onClick={() => toggleButton(setRun, run)}
                      className="text-white mb-1 text-sm border-2 border-[#8689EB] rounded-lg px-3 py-1"
                    >
                      {run ? "Set" : "Reset"}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-white mb-1">Pickup</p>
                  <div className="flex gap-4 items-center">
                    <p className="text-white mb-1">C</p>
                    <button
                      onClick={() => toggleButton(setPickup, pickup)}
                      className="text-white mb-1 text-sm border-2 border-[#8689EB] rounded-lg px-3 py-1"
                    >
                      {pickup ? "Set" : "Reset"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 md:w-1/2">
            <div className=" w-full">
              <h1 className="text-white text-xl">Web3</h1>
              <div className="flex gap-4 items-center px-4 pt-2 pb-4 justify-between ">
                <label className="text-white mb-1 pl-7">Enable Web3</label>
                <div
                  onClick={() => toggleButton(setWeb3Enabled, web3Enabled)}
                  className={`cursor-pointer text-white mb-1 text-sm border-2 border-[#8689EB] rounded-lg py-0.5 px-4 flex justify-center items-center ${
                    web3Enabled ? "bg-[#8689EB]" : "bg-transparent"
                  }`}
                >
                  {web3Enabled ? (
                    <FaToggleOn size={28} />
                  ) : (
                    <FaToggleOff size={28} />
                  )}
                </div>
              </div>
            </div>

            <div className="w-full">
              <h1 className="text-white text-xl">Notifications</h1>
              <div className="flex gap-4 items-center px-4 pt-2 pb-4 justify-between ">
                <label className="text-white mb-1 pl-7">
                  Enable Notifications
                </label>
                <div
                  onClick={() =>
                    toggleButton(setNotificationsEnabled, notificationsEnabled)
                  }
                  className={`cursor-pointer text-white mb-1 text-sm border-2 border-[#8689EB] rounded-lg py-0.5 px-4 flex justify-center items-center ${
                    notificationsEnabled ? "bg-[#8689EB]" : "bg-transparent"
                  }`}
                >
                  {notificationsEnabled ? (
                    <FaToggleOn size={28} />
                  ) : (
                    <FaToggleOff size={28} />
                  )}
                </div>
              </div>
            </div>

            <div className="w-full">
              <h1 className="text-white text-xl">Language Selection</h1>
              <div className="flex  items-center px-4 pt-2 pb-4 justify-between gap-10">
                <label className="text-white mb-1 pl-7">Select Language</label>
                <select
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
                  className="mt-2 p-2 rounded-lg bg-[#8689EB] text-white"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Chinese">Chinese</option>
                </select>
              </div>
            </div>

            <div className="w-full">
              <h1 className="text-white text-xl">Server</h1>
              <div className="flex items-center px-4 pt-2 pb-4 justify-between gap-10">
                <label className="text-white mb-1 pl-7">
                  Select Server Location
                </label>
                <select
                  value={selectedServer}
                  onChange={handleServerChange}
                  className="mt-2 p-2 rounded-lg bg-[#8689EB] text-white"
                >
                  <option value="US-East">US East</option>
                  <option value="US-West">US West</option>
                  <option value="Europe">Europe</option>
                  <option value="Asia">Asia</option>
                  <option value="Australia">Australia</option>
                </select>
              </div>
            </div>

            <div className="w-full">
              <h1 className="text-white text-xl">Social Media</h1>
              <div className="flex items-center px-4 pt-6 pb-4  gap-10 justify-center">
                {/* Twitter Icon */}
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTwitter className="text-[#8689EB] text-3xl hover:text-[#8689eba3] transition duration-200" />
                </a>

                {/* Facebook Icon */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebook className="text-[#8689EB] text-3xl hover:text-[#8689eba3] transition duration-200" />
                </a>

                {/* Instagram Icon */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram className="text-[#8689EB] text-3xl hover:text-[#8689eba3] transition duration-200" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
