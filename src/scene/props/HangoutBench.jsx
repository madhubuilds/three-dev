import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  playerPosition,
  useAvatarStore, 
  registerCollider,
  unregisterCollider,
} from "../../store/useAvatarStore";

// Shared blocky bench shapes
const seatGeo = new THREE.BoxGeometry(2.2, 0.18, 0.7);
const backGeo = new THREE.BoxGeometry(2.2, 0.55, 0.14);
const legGeo = new THREE.BoxGeometry(0.18, 0.5, 0.6);
const ringGeo = new THREE.RingGeometry(1.6, 1.8, 32);

export function HangoutBench({
  id = "bench-1",
  position = [0, 0, -4],
  rotation = [0, 0, 0],
  title = "Chai & Chill Spot",
  description = "A quiet corner to hang out, chat with nearby players, and check local events.",
  actionLabel = "Check Spot",
  interactRadius = 2.4,
}) {
  const isNearRef = useRef(false);
  const [isNear, setIsNear] = useState(false);
  // Register solid footprint when mounted, clean up when unmounted
  useEffect(() => {
    registerCollider(id, {
      x: position[0],
      z: position[2],
      halfW: 1.1,
      halfD: 0.38,
    });
    return () => unregisterCollider(id);
  }, [id, position[0], position[2]]);
  useFrame(() => {
    const dx = playerPosition.x - position[0];
    const dz = playerPosition.z - position[2];
    const dist = Math.hypot(dx, dz);
    const nearNow = dist <= interactRadius;

    // Only fire state updates when crossing the boundary
    if (nearNow !== isNearRef.current) {
      isNearRef.current = nearNow;
      setIsNear(nearNow);

      const store = useAvatarStore.getState();
      if (nearNow) {
        store.setNearbyProp({ id, title, description, actionLabel });
      } else if (store.nearbyProp?.id === id) {
        store.setNearbyProp(null);
      }
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Seat */}
      <mesh geometry={seatGeo} position={[0, 0.55, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#8B5A2B" />
      </mesh>

      {/* Backrest */}
      <mesh
        geometry={backGeo}
        position={[0, 0.9, -0.3]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#A06B3B" />
      </mesh>

      {/* Left & Right Legs */}
      <mesh geometry={legGeo} position={[-0.85, 0.25, 0]} castShadow>
        <meshStandardMaterial color="#080808" />
      </mesh>
      <mesh geometry={legGeo} position={[0.85, 0.25, 0]} castShadow>
        <meshStandardMaterial color="#080808" />
      </mesh>

      {/* Subtle Ground Ring: lights up yellow when player walks in range */}
      <mesh
        geometry={ringGeo}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, 0]}
      >
        <meshBasicMaterial
          color={isNear ? "#FFE600" : "#080808"}
          transparent
          opacity={isNear ? 0.9 : 0.15}
        />
      </mesh>
    </group>
  );
}
