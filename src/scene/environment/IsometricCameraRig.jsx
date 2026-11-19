import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  MapControls,
  OrbitControls,
  OrthographicCamera,
  PerspectiveCamera,
} from "@react-three/drei";
import * as THREE from "three";
import { playerPosition, useAvatarStore } from "../../store/useAvatarStore";

const DEFAULT_PAN = { minX: -4.5, maxX: 4.5, minZ: -4.5, maxZ: 4.5 };
const followCamGoal = new THREE.Vector3();
const followLookGoal = new THREE.Vector3();

export function IsometricCameraRig({ panBounds = DEFAULT_PAN }) {
  const cameraMode = useAvatarStore((s) => s.cameraMode);
  const controlsRef = useRef();
  const lastPlayer = useRef({ x: 0, z: 0 });

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0.8, 0);
      controlsRef.current.update();
    }
  }, [cameraMode]);

  useFrame((state) => {
    // 1. Third-Person Follow Mode
    if (cameraMode === "follow") {
      followCamGoal.set(playerPosition.x + 5.8, 5.2, playerPosition.z + 5.8);
      followLookGoal.set(playerPosition.x, 1.35, playerPosition.z);

      state.camera.position.lerp(followCamGoal, 0.08);
      state.camera.lookAt(followLookGoal);
      return;
    }

    // 2. Iso & 3D Orbit Modes (Bounded Pan + Player Auto-Follow)
    const controls = controlsRef.current;
    if (!controls) return;

    const dx = playerPosition.x - lastPlayer.current.x;
    const dz = playerPosition.z - lastPlayer.current.z;
    const isWalking = Math.hypot(dx, dz) > 0.001;

    if (isWalking) {
      lastPlayer.current.x = playerPosition.x;
      lastPlayer.current.z = playerPosition.z;

      controls.target.x = THREE.MathUtils.lerp(
        controls.target.x,
        playerPosition.x,
        0.08,
      );
      controls.target.z = THREE.MathUtils.lerp(
        controls.target.z,
        playerPosition.z,
        0.08,
      );
    }

    controls.target.x = THREE.MathUtils.clamp(
      controls.target.x,
      panBounds.minX,
      panBounds.maxX,
    );
    controls.target.z = THREE.MathUtils.clamp(
      controls.target.z,
      panBounds.minZ,
      panBounds.maxZ,
    );
    controls.target.y = 0.8;

    controls.update();
  });

  return (
    <>
      {cameraMode === "iso" ? (
        <>
          <OrthographicCamera
            makeDefault
            position={[12, 12, 12]}
            zoom={55}
            near={-50}
            far={100}
          />
          <MapControls
            ref={controlsRef}
            makeDefault
            enableRotate={false}
            enableDamping
            dampingFactor={0.08}
            minZoom={38}
            maxZoom={95}
          />
        </>
      ) : (
        <PerspectiveCamera
          makeDefault
          position={[12, 12, 12]}
          fov={38}
          near={0.1}
          far={120}
        />
      )}

      {cameraMode === "orbit" && (
        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableDamping
          dampingFactor={0.08}
          minPolarAngle={0.25}
          maxPolarAngle={Math.PI / 2 - 0.08}
          minDistance={7}
          maxDistance={28}
        />
      )}
    </>
  );
}
