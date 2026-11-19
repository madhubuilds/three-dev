import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { SceneLighting } from "./environment/SceneLighting";
import { PlayerController } from "./avatar/PlayerController";
import { useAvatarStore } from "../store/useAvatarStore";
import { HangoutBench } from "./props/HangoutBench";
import { ProfileDesk } from "./props/ProfileDesk";
import { IndoorPlant } from "./props/IndoorPlant";
import { IsometricCameraRig } from "./environment/IsometricCameraRig";
import { ContactShadows } from "@react-three/drei";
import { ProfileRoom } from "./environment/ProfileRoom";
import { WallDecor } from "./props/WallDecor";

export function WorldCanvas() {
  const { username, animation, chatMessage, colors, accessories } =
    useAvatarStore();

  return (
    <div className="fixed inset-0 h-[100dvh] w-screen touch-none">
      <Canvas
        shadows
        orthographic
        dpr={[1, 2]}
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
        camera={{ position: [12, 12, 12], zoom: 55, near: -50, far: 100 }}
      >
        <color attach="background" args={["#f4f4f0"]} />
        <SceneLighting />
        <IsometricCameraRig />
        <PlayerController
          bounds={6.3}
          username={username}
          chatMessage={chatMessage}
          animation={animation}
          skinColor={colors.skin}
          hairColor={colors.hair}
          shirtColor={colors.shirt}
          pantsColor={colors.pants}
          accessories={accessories}
        />
        <ProfileRoom />
        <WallDecor />
        <ProfileDesk position={[-3.2, 0, -5.5]} />
        <HangoutBench position={[3.2, 0, -5.2]} />
        <IndoorPlant id="plant-nw" position={[-5.9, 0, -5.9]} />
        <IndoorPlant id="plant-sw" position={[-5.9, 0, 5.5]} />

        <ContactShadows
          position={[0, 0.01, 0]}
          opacity={0.5}
          scale={16}
          blur={2.2}
          far={3.5}
          resolution={256}
          color="#3D1E08"
        />
      </Canvas>
    </div>
  );
}
