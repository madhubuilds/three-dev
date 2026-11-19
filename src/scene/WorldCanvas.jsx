import { Canvas } from "@react-three/fiber";
import { SceneLighting } from "./environment/SceneLighting";
import { PlayerController } from "./avatar/PlayerController";
import { useAvatarStore } from "../store/useAvatarStore";
import { HangoutBench } from "./props/HangoutBench";

export function WorldCanvas() {
  const { username, animation, chatMessage, colors, accessories } =
    useAvatarStore();

  return (
    <div className="fixed inset-0 h-[100dvh] w-screen touch-none">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 5, 8], fov: 50 }}>
        <color attach="background" args={["#f4f4f0"]} />
        <SceneLighting />

        <PlayerController
          username={username}
          chatMessage={chatMessage}
          animation={animation}
          skinColor={colors.skin}
          hairColor={colors.hair}
          shirtColor={colors.shirt}
          pantsColor={colors.pants}
          accessories={accessories}
        />
        <HangoutBench position={[0, 0, -4]} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[15, 15]} />
          <meshStandardMaterial color="#e5e5e5" />
        </mesh>
      </Canvas>
    </div>
  );
}
