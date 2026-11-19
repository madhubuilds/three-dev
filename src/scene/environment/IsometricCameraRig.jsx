import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MapControls } from "@react-three/drei";
import * as THREE from "three";
import { playerPosition } from "../../store/useAvatarStore";

const PAN_LIMIT = 4.5; // Max distance user can pan from room center

export function IsometricCameraRig() {
  const controlsRef = useRef();
  const lastPlayer = useRef({ x: playerPosition.x, z: playerPosition.z });

  useFrame(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    // Check if player walked since last frame
    const dx = playerPosition.x - lastPlayer.current.x;
    const dz = playerPosition.z - lastPlayer.current.z;
    const isWalking = Math.hypot(dx, dz) > 0.001;

    if (isWalking) {
      lastPlayer.current.x = playerPosition.x;
      lastPlayer.current.z = playerPosition.z;

      // Gently follow player while walking
      controls.target.x = THREE.MathUtils.lerp(controls.target.x, playerPosition.x, 0.08);
      controls.target.z = THREE.MathUtils.lerp(controls.target.z, playerPosition.z, 0.08);
    }

    // Clamp pan limits so user cannot drag into empty space
    controls.target.x = THREE.MathUtils.clamp(controls.target.x, -PAN_LIMIT, PAN_LIMIT);
    controls.target.z = THREE.MathUtils.clamp(controls.target.z, -PAN_LIMIT, PAN_LIMIT);
    controls.target.y = 0.8;

    controls.update();
  });

  return (
    <MapControls
      ref={controlsRef}
      makeDefault
      enableRotate={false} // Lock true isometric angle
      enableDamping
      dampingFactor={0.08}
      minZoom={38}
      maxZoom={95}
    />
  );
}