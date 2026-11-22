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
  const bodyGroup = useRef();
  const leftShoulder = useRef();
  const rightShoulder = useRef();
  const leftHip = useRef();
  const rightHip = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const lerp = THREE.MathUtils.lerp;

    // Default target angles & body offsets (Idle)
    let bodyY = 0;
    let bodyTiltZ = 0;
    let leftArmX = 0;
    let leftArmZ = -0.05 - Math.sin(t * 2) * 0.03;
    let rightArmX = 0;
    let rightArmZ = 0.05 + Math.sin(t * 2) * 0.03;
    let leftLegX = 0;
    let rightLegX = 0;

    if (animation === "walk") {
      const swing = Math.sin(t * 6) * 0.65;
      leftArmX = swing;
      leftArmZ = 0;
      rightArmX = -swing;
      rightArmZ = 0;
      leftLegX = -swing;
      rightLegX = swing;
    } else if (animation === "wave") {
      rightArmZ = 2.6 + Math.sin(t * 10) * 0.3;
    } else if (animation === "sit") {
      bodyY = -0.12;
      leftLegX = -Math.PI / 2.1;
      rightLegX = -Math.PI / 2.1;
      leftArmX = -0.25;
      leftArmZ = -0.1;
      rightArmX = -0.25;
      rightArmZ = 0.1;
    } else if (animation === "cheer") {
      bodyY = Math.abs(Math.sin(t * 7)) * 0.18;
      leftArmZ = -2.65 - Math.sin(t * 10) * 0.18;
      rightArmZ = 2.65 + Math.sin(t * 10) * 0.18;
    } else if (animation === "dance") {
      const sway = Math.sin(t * 5.5);
      bodyY = Math.abs(Math.cos(t * 5.5)) * 0.08;
      bodyTiltZ = sway * 0.08;
      leftArmX = sway * 0.85;
      leftArmZ = -0.45;
      rightArmX = -sway * 0.85;
      rightArmZ = 0.45;
      leftLegX = -sway * 0.35;
      rightLegX = sway * 0.35;
    }

    // Smoothly blend body & limbs toward target pose
    if (bodyGroup.current) {
      bodyGroup.current.position.y = lerp(
        bodyGroup.current.position.y,
        bodyY,
        0.16,
      );
      bodyGroup.current.rotation.z = lerp(
        bodyGroup.current.rotation.z,
        bodyTiltZ,
        0.16,
      );
    }

    leftShoulder.current.rotation.x = lerp(
      leftShoulder.current.rotation.x,
      leftArmX,
      0.14,
    );
    leftShoulder.current.rotation.z = lerp(
      leftShoulder.current.rotation.z,
      leftArmZ,
      0.16,
    );
    rightShoulder.current.rotation.x = lerp(
      rightShoulder.current.rotation.x,
      rightArmX,
      0.14,
    );
    rightShoulder.current.rotation.z = lerp(
      rightShoulder.current.rotation.z,
      rightArmZ,
      0.16,
    );
    leftHip.current.rotation.x = lerp(
      leftHip.current.rotation.x,
      leftLegX,
      0.16,
    );
    rightHip.current.rotation.x = lerp(
      rightHip.current.rotation.x,
      rightLegX,
      0.16,
    );
  });

  return (
    <group position={position}>
      {/* Floating Name + Chat Bubble */}
      <AvatarLabel username={username} message={chatMessage} />

      {/* Animated Character Body */}
      <group ref={bodyGroup}>
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
    </group>
  );
}
