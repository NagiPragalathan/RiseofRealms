import {
  AccumulativeShadows,
  Html,
  RandomizedLight,
  Text3D,
  useFont,
} from "@react-three/drei";
import { motion } from "framer-motion-3d";
import { useAtom } from "jotai";
import { Suspense, useMemo, useRef, useState } from "react";
import { LobbyAvatar } from "./LobbyAvatar";
import { Skyscraper } from "./Skyscraper";
import { mapAtom, roomIDAtom, roomsAtom, socket } from "./SocketManager";
import { Tablet } from "./Tablet";
import { avatarUrlAtom } from "./UI";
import { useNavigate } from "react-router-dom";

let firstLoad = true;

export const Lobby = () => {
  const navigate = useNavigate();
  const [rooms] = useAtom(roomsAtom);
  const [avatarUrl] = useAtom(avatarUrlAtom);
  const [_roomID, setRoomID] = useAtom(roomIDAtom);
  const [_map, setMap] = useAtom(mapAtom);

  const [activeView, setActiveView] = useState("lobby"); // State for toggling between views

  const joinRoom = (roomId) => {
    socket.emit("joinRoom", roomId, {
      avatarUrl,
    });
    setMap(null);
    setRoomID(roomId);
  };

  const isMobile = window.innerWidth < 1024;
  const tablet = useRef();
  const goldenRatio = Math.min(1, window.innerWidth / 1600);

  const accumulativeShadows = useMemo(
    () => (
      <AccumulativeShadows
        temporal
        frames={30}
        alphaTest={0.85}
        scale={50}
        position={[0, 0, 0]}
        color="pink"
      >
        <RandomizedLight
          amount={4}
          radius={9}
          intensity={0.55}
          ambient={0.25}
          position={[5, 5, -20]}
        />
        <RandomizedLight
          amount={4}
          radius={5}
          intensity={0.25}
          ambient={0.55}
          position={[-5, 5, -20]}
        />
      </AccumulativeShadows>
    ),
    []
  );

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent); // Safari fix

  return (
    <group position-y={-1.5}>
      <motion.group
        ref={tablet}
        scale={isMobile ? 0.18 : 0.22}
        position-x={isMobile ? 0 : -0.25 * goldenRatio}
        position-z={0.5}
        initial={{
          y: firstLoad ? 0.5 : 1.5,
          rotateY: isSafari ? 0 : isMobile ? 0 : Math.PI / 8,
        }}
        animate={{
          y: isMobile ? 1.65 : 1.5,
        }}
        transition={{
          duration: 1,
          delay: 0.5,
        }}
        onAnimationComplete={() => {
          firstLoad = false;
        }}
      >
        <Tablet scale={0.03} rotation-x={Math.PI / 2} />
        <Html
          position={[0, 0.17, 0.11]}
          transform={!isSafari}
          center
          scale={0.121}
          className="relative"
        >
          <div className="flex justify-between absolute -top-16 w-full">
            <button
              className={`bg-[#FE8C8C] p-3 rounded-md font-semibold text-lg left-0 ${
                activeView === "games" ? "opacity-50" : ""
              }`}
              onClick={() => setActiveView("games")} // Switch to games view
            >
              2D Games
            </button>
            <button
              className={`bg-[#FE8C8C] p-3 rounded-md font-semibold text-lg right-0 ${
                activeView === "lobby" ? "opacity-50" : ""
              }`}
              onClick={() => setActiveView("lobby")} // Switch to lobby view
            >
              Explore Lobby
            </button>
          </div>
          <div
            className={`${
              isSafari
                ? "w-[310px] h-[416px] lg:w-[390px] lg:h-[514px]"
                : "w-[390px] h-[514px]"
            }  max-w-full  overflow-y-auto p-5  place-items-center pointer-events-none select-none relative`}
          >
            <div className="w-full overflow-y-auto flex flex-col space-y-2">
              <h1 className="text-center text-white text-2xl font-bold">
                WELCOME TO
                <br />
                RISE OF REALMS
              </h1>
              <p className="text-center text-white">
                {activeView === "lobby"
                  ? "Please select a room to relax"
                  : "Please select a game to play"}
              </p>

              {activeView === "lobby"
                ? // Display rooms if "Explore Lobby" is active
                  rooms.map((room) => (
                    <div
                      key={room.id}
                      className="p-4 rounded-lg bg-slate-800 bg-opacity-70 text-white hover:bg-slate-950 transition-colors cursor-pointer pointer-events-auto"
                      onClick={() => joinRoom(room.id)}
                    >
                      <p className="text-uppercase font-bold text-lg">
                        {room.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full ${
                            room.nbCharacters > 0
                              ? "bg-green-500"
                              : "bg-orange-500"
                          }`}
                        ></div>
                        {room.nbCharacters} people in this room
                      </div>
                    </div>
                  ))
                : // Display games if "2D Games" is active
                  rooms.map((room) => (
                    <div
                      key={room.id}
                      className="p-4 rounded-lg bg-slate-800 bg-opacity-70 text-white hover:bg-slate-950 transition-colors cursor-pointer pointer-events-auto"
                      onClick={() => joinRoom(room.id)}
                    >
                      <p className="text-uppercase font-bold text-lg">
                        {room.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full ${
                            room.nbCharacters > 0
                              ? "bg-green-500"
                              : "bg-orange-500"
                          }`}
                        ></div>
                        {room.nbCharacters} people in this room
                      </div>
                    </div>
                  ))}
            </div>
          </div>
          <div className="absolute -left-full top-1/2 transform -translate-y-1/2 flex flex-col space-y-4">
            <button
              className="bg-[#FE8C8C] p-3 rounded-md font-semibold text-lg"
              onClick={() => navigate("/selectmap")} // Navigate to Select Map
            >
              SHOP
            </button>
            <button
              className="bg-[#FE8C8C] p-3 rounded-md font-semibold text-lg"
              onClick={() => navigate("/marketplace")} // Navigate to Marketplace
            >
              MARKET PLACE
            </button>
            <button
              className="bg-[#FE8C8C] p-3 rounded-md font-semibold text-lg"
              onClick={() => navigate("/virtualgirlfriend")} // Navigate to Virtual GF
            >
              VIRTUAL GF
            </button>
            <button
              className="bg-[#FE8C8C] p-3 rounded-md font-semibold text-lg"
              onClick={() => navigate("/settings")} // Navigate to Settings
            >
              SETTINGS
            </button>
            <button
              className="bg-[#FE8C8C] p-3 rounded-md font-semibold text-lg"
              onClick={() => navigate("/")} // Exit or navigate to home
            >
              EXIT
            </button>
          </div>
        </Html>
      </motion.group>
      <group position-z={-8} rotation-y={Math.PI / 6}>
        <Text3D
          font={"fonts/Inter_Bold.json"}
          position-z={1}
          size={0.3}
          position-x={-3}
          castShadow
          rotation-y={Math.PI / 8}
          bevelEnabled
          bevelThickness={0.005}
          letterSpacing={0.012}
        >
          RISE OF
          <meshStandardMaterial color="white" />
        </Text3D>

        <Text3D
          font={"fonts/Inter_Bold.json"}
          position-z={2.5}
          size={0.3}
          position-x={-3}
          castShadow
          rotation-y={Math.PI / 8}
          bevelEnabled
          bevelThickness={0.005}
          letterSpacing={0.012}
        >
          REALMS
          <meshStandardMaterial color="white" />
        </Text3D>
        <Skyscraper scale={1.32} />
        <Skyscraper scale={1} position-x={-3} position-z={-1} />
        <Skyscraper scale={0.8} position-x={3} position-z={-0.5} />
      </group>
      {accumulativeShadows}
      <Suspense>
        <LobbyAvatar
          position-z={-1}
          position-x={0.5 * goldenRatio}
          position-y={isMobile ? -0.4 : 0}
          rotation-y={-Math.PI / 8}
        />
      </Suspense>
    </group>
  );
};

useFont.preload("/fonts/Inter_Bold.json");
