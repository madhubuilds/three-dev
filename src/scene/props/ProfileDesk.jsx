import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { playerPosition, useAvatarStore } from "../../store/useAvatarStore";
import { useCollider } from "../hooks/useCollider";

const deskTopGeo = new THREE.BoxGeometry(2.4, 0.14, 1.1);
const deskLegGeo = new THREE.BoxGeometry(0.14, 0.85, 0.9);
const monitorStandGeo = new THREE.BoxGeometry(0.18, 0.3, 0.18);
const monitorScreenGeo = new THREE.BoxGeometry(1.1, 0.65, 0.08);
const ringGeo = new THREE.RingGeometry(1.6, 1.8, 32);
const lampBaseGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.08, 16);
const lampBulbGeo = new THREE.SphereGeometry(0.16, 16, 16);
export function ProfileDesk({
  id = "profile-desk",
  position = [-3.5, 0, -5.6],
  interactRadius = 2.4,
}) {
  const isNearRef = useRef(false);
  const [isNear, setIsNear] = useState(false);

  // 1-line solid collision
  useCollider(id, position[0], position[2], 1.2, 0.58);

  useFrame(() => {
    const dist = Math.hypot(
      playerPosition.x - position[0],
      playerPosition.z - position[2],
    );
    const nearNow = dist <= interactRadius;

    if (nearNow !== isNearRef.current) {
      isNearRef.current = nearNow;
      setIsNear(nearNow);

      const store = useAvatarStore.getState();
      if (nearNow) {
        store.setNearbyProp({
          id,
          type: "profile",
          actionLabel: "My Profile",
        });
      } else if (store.nearbyProp?.id === id) {
        store.setNearbyProp(null);
      }
    }
  });

  return (
    <group position={position}>
      {/* Desk Surface */}
      <mesh
        geometry={deskTopGeo}
        position={[0, 0.85, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#8B5A2B" roughness={0.8} />
      </mesh>

      {/* Legs */}
      <mesh geometry={deskLegGeo} position={[-1.05, 0.42, 0]} castShadow>
        <meshStandardMaterial color="#080808" roughness={0.8} />
      </mesh>
      <mesh geometry={deskLegGeo} position={[1.05, 0.42, 0]} castShadow>
        <meshStandardMaterial color="#080808" roughness={0.8} />
      </mesh>

      {/* Monitor */}
      <mesh geometry={monitorStandGeo} position={[0, 1.05, -0.2]} castShadow>
        <meshStandardMaterial color="#080808" roughness={0.8} />
      </mesh>
      <mesh geometry={monitorScreenGeo} position={[0, 1.45, -0.2]} castShadow>
        <meshStandardMaterial
          color="#17233F"
          emissive="#FF5A1F"
          emissiveIntensity={0.25}
        />
      </mesh>
      {/* Glowing Dome Desk Lamp */}
      <group position={[-0.85, 0.92, 0.15]}>
        <mesh geometry={lampBaseGeo} position={[0, 0.04, 0]} castShadow>
          <meshStandardMaterial color="#080808" roughness={0.7} />
        </mesh>
        <mesh geometry={lampBulbGeo} position={[0, 0.18, 0]}>
          <meshStandardMaterial
            color="#FFFDF7"
            emissive="#FFAD5C"
            emissiveIntensity={2.0}
            toneMapped={false}
          />
        </mesh>
      </group>
      {/* Interaction Ring */}
      <mesh
        geometry={ringGeo}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.03, 0.4]}
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
