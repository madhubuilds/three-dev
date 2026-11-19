import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { AvatarLabel } from "./AvatarLabel";
import { Glasses, Hair, Hat } from "../avatar/AvatarAccessories";
import { AvatarFace } from "./face/AvatarFace";

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

export function RobloxAvatar({
  position = [0, 0, 0],
  skinColor = "#FFE600",
  hairColor = "#080808",
  shirtColor = "#FF5A1F",
  pantsColor = "#17233F",
  animation = "idle",
  username = "Player",
  chatMessage = "",
  accessories = { hair: "classic", hat: "none", glasses: "none" },
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
        <AvatarFace
          eyes={accessories.eyes}
          nose={accessories.nose}
          mouth={accessories.mouth}
          mustache={accessories.mustache}
          skinColor={skinColor}
          hairColor={hairColor}
        />
        <Hair type={accessories.hair} color={hairColor} />
        <Hat type={accessories.hat} />
        <Glasses type={accessories.glasses} />
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
