import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MapControls } from "@react-three/drei";
import * as THREE from "three";
import { playerPosition } from "../../store/useAvatarStore";

const DEFAULT_PAN = { minX: -4.5, maxX: 4.5, minZ: -4.5, maxZ: 4.5 };

export function IsometricCameraRig({ panBounds = DEFAULT_PAN }) {
  const controlsRef = useRef();
  const lastPlayer = useRef({ x: 0, z: 0 });

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0.8, 0);
      controlsRef.current.update();
    }
  }, []);

  useFrame(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const dx = playerPosition.x - lastPlayer.current.x;
    const dz = playerPosition.z - lastPlayer.current.z;
    const isWalking = Math.hypot(dx, dz) > 0.001;

    if (isWalking) {
      lastPlayer.current.x = playerPosition.x;
      lastPlayer.current.z = playerPosition.z;

      controls.target.x = THREE.MathUtils.lerp(controls.target.x, playerPosition.x, 0.08);
      controls.target.z = THREE.MathUtils.lerp(controls.target.z, playerPosition.z, 0.08);
    }

    controls.target.x = THREE.MathUtils.clamp(controls.target.x, panBounds.minX, panBounds.maxX);
    controls.target.z = THREE.MathUtils.clamp(controls.target.z, panBounds.minZ, panBounds.maxZ);
    controls.target.y = 0.8;

    controls.update();
  });

  return (
    <MapControls
      ref={controlsRef}
      makeDefault
      enableRotate={false}
      enableDamping
      dampingFactor={0.08}
      minZoom={38}
      maxZoom={95}
    />
  );
}