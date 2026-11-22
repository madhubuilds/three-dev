import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { SceneLighting } from "./environment/SceneLighting";
import { DevWorldBuilder } from "./dev/DevWorldBuilder";
import { useDevBuilderStore } from "../store/useDevBuilderStore";

export function DevBuilderCanvas() {
  const isDraggingGizmo = useDevBuilderStore((s) => s.isDraggingGizmo);
  const theme = useDevBuilderStore((s) => s.theme);
  const isDark = theme === "dark";

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: isDark ? 1.0 : 1.06,
      }}
      camera={{ position: [9, 8, 9], fov: 42, near: 0.1, far: 120 }}
      className="h-full w-full touch-none"
    >
      <color attach="background" args={[isDark ? "#0B0F19" : "#F3ECE4"]} />

      <SceneLighting />

      {/* Studio Workbench Floor Pad */}
      <mesh position={[0, -0.15, 0]} receiveShadow>
        <boxGeometry args={[24, 0.3, 24]} />
        <meshStandardMaterial
          color={isDark ? "#151C2C" : "#FAF5EF"}
          roughness={0.86}
        />
      </mesh>

      <ContactShadows
        position={[0, 0.005, 0]}
        opacity={isDark ? 0.55 : 0.32}
        scale={24}
        blur={2}
        far={8}
        color={isDark ? "#020408" : "#3D2B1F"}
      />

      {/* Interactive Grid-Snapping Block Builder */}
      <DevWorldBuilder size={24} />

      {/* 360° Orbit, Pan & Zoom */}
      <OrbitControls
        makeDefault
        enabled={!isDraggingGizmo}
        target={[0, 1, 0]}
        maxPolarAngle={Math.PI / 2 - 0.04}
        minDistance={3}
        maxDistance={32}
        enableDamping
        dampingFactor={0.08}
      />
    </Canvas>
  );
}