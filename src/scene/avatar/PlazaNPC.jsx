import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RobloxAvatar } from "./RobloxAvatar";
import { playerPosition, useAvatarStore } from "../../store/useAvatarStore";
import { useCollider } from "../hooks/useCollider";

const UP_AXIS = new THREE.Vector3(0, 1, 0);
const targetQuat = new THREE.Quaternion();
const ringGeo = new THREE.RingGeometry(0.75, 0.92, 32);

export function PlazaNPC({
  id,
  name,
  position = [0, 0, 0],
  defaultRotY = 0,
  colors,
  accessories,
  greeting = "Hey there!",
  dialogue = ["Welcome to the Plaza!"],
  interactRadius = 2.6,
}) {
  const npcRef = useRef();
  const isNearRef = useRef(false);
  const [isNear, setIsNear] = useState(false);

  // Solid collision so player cannot walk through the NPC
  useCollider(id, position[0], position[2], 0.45, 0.45);

  useFrame(() => {
    if (!npcRef.current) return;

    const dx = playerPosition.x - position[0];
    const dz = playerPosition.z - position[2];
    const dist = Math.hypot(dx, dz);
    const nearNow = dist <= interactRadius;

    // Smoothly turn toward player when close, or return to idle angle
    const desiredAngle = nearNow ? Math.atan2(dx, dz) : defaultRotY;
    targetQuat.setFromAxisAngle(UP_AXIS, desiredAngle);
    npcRef.current.quaternion.slerp(targetQuat, 0.12);

    // Only trigger React / Zustand updates when crossing the radius boundary
    if (nearNow !== isNearRef.current) {
      isNearRef.current = nearNow;
      setIsNear(nearNow);

      const store = useAvatarStore.getState();
      if (nearNow) {
        store.setNearbyProp({
          id,
          type: "npc",
          name,
          dialogue,
          actionLabel: `Talk to ${name}`,
        });
      } else if (store.nearbyProp?.id === id) {
        store.setNearbyProp(null);
      }
    }
  });

  return (
    <group position={position}>
      <group ref={npcRef} rotation={[0, defaultRotY, 0]}>
        <RobloxAvatar
          username={name}
          animation={isNear ? "wave" : "idle"}
          chatMessage={isNear ? greeting : ""}
          skinColor={colors.skin}
          hairColor={colors.hair}
          shirtColor={colors.shirt}
          pantsColor={colors.pants}
          accessories={accessories}
        />
      </group>

      {/* Proximity Ring on Ground */}
      <mesh
        geometry={ringGeo}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.03, 0]}
      >
        <meshBasicMaterial
          color={isNear ? "#FFE600" : "#080808"}
          transparent
          opacity={isNear ? 0.95 : 0.18}
        />
      </mesh>
    </group>
  );
}