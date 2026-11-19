import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { SceneLighting } from "./environment/SceneLighting";
import { OpenPlaza } from "./environment/OpenPlaza";
import { IsometricCameraRig } from "./environment/IsometricCameraRig";
import { PlayerController } from "./avatar/PlayerController";
import { PlazaNPC } from "./avatar/PlazaNPC";
import { HangoutBench } from "./props/HangoutBench";
import { useAvatarStore } from "../store/useAvatarStore";

export function PlazaCanvas() {
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
        camera={{ position: [12, 12, 12], zoom: 52, near: -50, far: 100 }}
      >
        <SceneLighting />
        <OpenPlaza />
        <IsometricCameraRig
          panBounds={{ minX: -5.5, maxX: 5.5, minZ: -5.5, maxZ: 5.5 }}
        />

        <PlayerController
          bounds={{ minX: -8.0, maxX: 8.0, minZ: -8.0, maxZ: 8.0 }}
          username={username}
          chatMessage={chatMessage}
          animation={animation}
          skinColor={colors.skin}
          hairColor={colors.hair}
          shirtColor={colors.shirt}
          pantsColor={colors.pants}
          accessories={accessories}
        />

        {/* NPC 1: Plaza Host */}
        <PlazaNPC
          id="npc-aarav"
          name="Aarav"
          position={[-2.4, 0, -2.0]}
          defaultRotY={0.6}
          greeting="Yo! Welcome to the Plaza!"
          dialogue={[
            "Hey! Glad you made it out to the courtyard.",
            "You can customize your full look in the Avatar studio anytime.",
            "Soon real players will be hanging out right here in real time!",
          ]}
          colors={{
            skin: "#F4C28C",
            hair: "#080808",
            shirt: "#17233F",
            pants: "#080808",
          }}
          accessories={{
            hair: "spiky",
            hat: "cap",
            glasses: "shades",
            eyes: "classic",
            nose: "button",
            mouth: "smirk",
            mustache: "none",
          }}
        />

        {/* NPC 2: Design Enthusiast */}
        <PlazaNPC
          id="npc-diya"
          name="Diya"
          position={[3.0, 0, -3.5]}
          defaultRotY={-0.5}
          greeting="Love your outfit!"
          dialogue={[
            "Have you tried the Midnight theme in your Profile Room yet?",
            "The neon cube lamp and mushroom lamp look awesome at night.",
            "Tap Wave Back if you want to say hi!",
          ]}
          colors={{
            skin: "#E8B07D",
            hair: "#1E1B18",
            shirt: "#FFE600",
            pants: "#17233F",
          }}
          accessories={{
            hair: "bob",
            hat: "none",
            glasses: "none",
            eyes: "happy",
            nose: "button",
            mouth: "smile",
            mustache: "none",
          }}
        />

        <HangoutBench position={[0, 0, -6.2]} />

        <ContactShadows
          position={[0, 0.01, 0]}
          opacity={0.45}
          scale={20}
          blur={2.2}
          far={3.5}
          resolution={256}
          color="#3D1E08"
        />
      </Canvas>
    </div>
  );
}
