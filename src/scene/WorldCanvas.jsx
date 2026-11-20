import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { SceneLighting } from "./environment/SceneLighting";
import { ProfileRoom } from "./environment/ProfileRoom";
import { IsometricCameraRig } from "./environment/IsometricCameraRig";
import { PlayerController } from "./avatar/PlayerController";
import { HangoutBench } from "./props/HangoutBench";
import { ProfileDesk } from "./props/ProfileDesk";
import { IndoorPlant } from "./props/IndoorPlant";
import { WallDecor } from "./props/WallDecor";
import { WallBioBoard } from "./props/WallBioBoard";
import { PlacedFurnitureLayer } from "./props/RoomFurniture";
import { useAvatarStore } from "../store/useAvatarStore";
import { TapToWalkFloor } from "./environment/TapToWalkFloor";

export function WorldCanvas() {
  const { username, animation, chatMessage, colors, accessories } =
    useAvatarStore();

  return (
    <div className="fixed inset-0 h-[100dvh] w-screen touch-none">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
        camera={{ position: [12, 12, 12], zoom: 55, near: -50, far: 100 }}
      >
        <SceneLighting />
        <ProfileRoom />
        <TapToWalkFloor
          bounds={{ minX: -6.3, maxX: 6.3, minZ: -6.3, maxZ: 6.3 }}
        />
        <WallDecor />
        <WallBioBoard />
        <PlacedFurnitureLayer />
        <IsometricCameraRig />

        <PlayerController
          bounds={{ minX: -6.3, maxX: 6.3, minZ: -6.3, maxZ: 6.3 }}
          username={username}
          chatMessage={chatMessage}
          animation={animation}
          skinColor={colors.skin}
          hairColor={colors.hair}
          shirtColor={colors.shirt}
          pantsColor={colors.pants}
          accessories={accessories}
        />

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
