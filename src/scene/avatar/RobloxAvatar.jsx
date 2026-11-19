import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { AvatarLabel } from "./AvatarLabel";

// Shared body shapes
const headGeo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
const torsoGeo = new THREE.BoxGeometry(1.0, 1.2, 0.5);
const armGeo = new THREE.BoxGeometry(0.4, 1.1, 0.4);
const legGeo = new THREE.BoxGeometry(0.45, 1.0, 0.45);

// Shared face shapes
const eyeGeo = new THREE.BoxGeometry(0.08, 0.1, 0.04);
const noseGeo = new THREE.BoxGeometry(0.08, 0.08, 0.08);
const mouthGeo = new THREE.BoxGeometry(0.18, 0.05, 0.04);

// Shared hair shapes
const hairTopGeo = new THREE.BoxGeometry(0.66, 0.16, 0.66);
const hairBackGeo = new THREE.BoxGeometry(0.66, 0.42, 0.14);
const hairBangsGeo = new THREE.BoxGeometry(0.66, 0.12, 0.12);

function Face({ noseColor }) {
  return (
    <group>
      <mesh geometry={eyeGeo} position={[-0.12, 0.06, 0.3]}>
        <meshStandardMaterial color="#080808" />
      </mesh>
      <mesh geometry={eyeGeo} position={[0.12, 0.06, 0.3]}>
        <meshStandardMaterial color="#080808" />
      </mesh>
      <mesh geometry={noseGeo} position={[0, -0.02, 0.32]}>
        <meshStandardMaterial color={noseColor} />
      </mesh>
      <mesh geometry={mouthGeo} position={[0, -0.15, 0.3]}>
        <meshStandardMaterial color="#080808" />
      </mesh>
    </group>
  );
}

function Hair({ color }) {
  return (
    <group>
      <mesh geometry={hairTopGeo} position={[0, 0.31, 0]} castShadow>
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh geometry={hairBackGeo} position={[0, 0.1, -0.28]} castShadow>
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh geometry={hairBangsGeo} position={[0, 0.23, 0.28]} castShadow>
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

export function RobloxAvatar({
  position = [0, 0, 0],
  skinColor = "#FFE600",
  hairColor = "#080808",
  shirtColor = "#FF5A1F",
  pantsColor = "#17233F",
  animation = "idle",
  username = "Player",
  chatMessage = "",
}) {
  const leftShoulder = useRef();
  const rightShoulder = useRef();
  const leftHip = useRef();
  const rightHip = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const lerp = THREE.MathUtils.lerp;

    // Default target angles (Idle)
    let leftArmX = 0;
    let rightArmX = 0;
    let rightArmZ = 0.05 + Math.sin(t * 2) * 0.03; // subtle breathing sway
    let leftLegX = 0;
    let rightLegX = 0;

    if (animation === "walk") {
      const swing = Math.sin(t * 6) * 0.65;
      leftArmX = swing;
      rightArmX = -swing;
      rightArmZ = 0;
      leftLegX = -swing;
      rightLegX = swing;
    } else if (animation === "wave") {
      // Raise right arm up and wave side-to-side
      rightArmZ = 2.6 + Math.sin(t * 10) * 0.3;
    }

    // Smoothly blend toward target angles
    leftShoulder.current.rotation.x = lerp(
      leftShoulder.current.rotation.x,
      leftArmX,
      0.12,
    );
    rightShoulder.current.rotation.x = lerp(
      rightShoulder.current.rotation.x,
      rightArmX,
      0.12,
    );
    rightShoulder.current.rotation.z = lerp(
      rightShoulder.current.rotation.z,
      rightArmZ,
      0.15,
    );
    leftHip.current.rotation.x = lerp(
      leftHip.current.rotation.x,
      leftLegX,
      0.12,
    );
    rightHip.current.rotation.x = lerp(
      rightHip.current.rotation.x,
      rightLegX,
      0.12,
    );
  });

  return (
    <group position={position}>
      {/* Floating Name + Chat Bubble */}
      <AvatarLabel username={username} message={chatMessage} />
      {/* HEAD GROUP */}
      <group position={[0, 2.55, 0]}>
        <mesh geometry={headGeo} castShadow>
          <meshStandardMaterial color={skinColor} />
        </mesh>
        <Face noseColor={skinColor} />
        <Hair color={hairColor} />
      </group>

      {/* TORSO */}
      <mesh geometry={torsoGeo} position={[0, 1.6, 0]} castShadow>
        <meshStandardMaterial color={shirtColor} />
      </mesh>

      {/* LEFT ARM */}
      <group ref={leftShoulder} position={[-0.75, 2.2, 0]}>
        <mesh geometry={armGeo} position={[0, -0.55, 0]} castShadow>
          <meshStandardMaterial color={skinColor} />
        </mesh>
      </group>

      {/* RIGHT ARM */}
      <group ref={rightShoulder} position={[0.75, 2.2, 0]}>
        <mesh geometry={armGeo} position={[0, -0.55, 0]} castShadow>
          <meshStandardMaterial color={skinColor} />
        </mesh>
      </group>

      {/* LEFT LEG */}
      <group ref={leftHip} position={[-0.26, 1.0, 0]}>
        <mesh geometry={legGeo} position={[0, -0.5, 0]} castShadow>
          <meshStandardMaterial color={pantsColor} />
        </mesh>
      </group>

      {/* RIGHT LEG */}
      <group ref={rightHip} position={[0.26, 1.0, 0]}>
        <mesh geometry={legGeo} position={[0, -0.5, 0]} castShadow>
          <meshStandardMaterial color={pantsColor} />
        </mesh>
      </group>
    </group>
  );
}
