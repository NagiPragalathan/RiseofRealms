import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { GFExperience } from "./GFExperience";
import { GFUI } from "./GFUI";
import "./GFCSS.css";

function GFHomePage() {
  return (
    <>
      <Loader />
      <Leva hidden />
      <GFUI />
      <Canvas shadows camera={{ position: [0, 0, 1], fov: 30 }}>
        <GFExperience />
      </Canvas>
    </>
  );
}

export default GFHomePage;