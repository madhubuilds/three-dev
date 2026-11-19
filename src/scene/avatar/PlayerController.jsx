import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RobloxAvatar } from "./RobloxAvatar";
import {
  joystickInput,
  playerPosition,
  colliders,
} from "../../store/useAvatarStore";

// Reusable math objects (created once outside useFrame for speed)
const UP_AXIS = new THREE.Vector3(0, 1, 0);
const targetQuat = new THREE.Quaternion();

// Camera positioning helpers
const CAMERA_OFFSET = new THREE.Vector3(0, 5, 8);
const desiredCamPos = new THREE.Vector3();
const lookTarget = new THREE.Vector3();
const PLAYER_RADIUS = 0.45;

function hitsAnyCollider(x, z) {
  for (const box of colliders.values()) {
    const overlapX = Math.abs(x - box.x) < box.halfW + PLAYER_RADIUS;
    const overlapZ = Math.abs(z - box.z) < box.halfD + PLAYER_RADIUS;
    if (overlapX && overlapZ) return true;
  }
  return false;
}

export function PlayerController({
  speed = 4,
  bounds = 7,
  animation = "idle",
  ...avatarProps
}) {
  const playerRef = useRef();
  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });
  const wasMoving = useRef(false);
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    const handleKey = (e, isDown) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
        return;
      if (e.code === "KeyW" || e.code === "ArrowUp")
        keys.current.forward = isDown;
      if (e.code === "KeyS" || e.code === "ArrowDown")
        keys.current.backward = isDown;
      if (e.code === "KeyA" || e.code === "ArrowLeft")
        keys.current.left = isDown;
      if (e.code === "KeyD" || e.code === "ArrowRight")
        keys.current.right = isDown;
    };

    const onKeyDown = (e) => handleKey(e, true);
    const onKeyUp = (e) => handleKey(e, false);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    if (!playerRef.current) return;

    const { forward, backward, left, right } = keys.current;
    const keyX = (right ? 1 : 0) - (left ? 1 : 0);
    const keyZ = (backward ? 1 : 0) - (forward ? 1 : 0);

    // Use joystick if pushed past deadzone, otherwise fall back to WASD
    const hasJoy = Math.hypot(joystickInput.x, joystickInput.y) > 0.1;
    let moveX = hasJoy ? joystickInput.x : keyX;
    let moveZ = hasJoy ? joystickInput.y : keyZ;

    const movingNow = moveX !== 0 || moveZ !== 0;

    if (movingNow !== wasMoving.current) {
      wasMoving.current = movingNow;
      setIsMoving(movingNow);
    }

    // 1. Move, collide-and-slide, and rotate
    if (movingNow) {
      const length = Math.hypot(moveX, moveZ);
      if (length > 1) {
        moveX /= length;
        moveZ /= length;
      }

      const step = speed * Math.min(delta, 0.1);
      const currX = playerRef.current.position.x;
      const currZ = playerRef.current.position.z;

      const nextX = THREE.MathUtils.clamp(currX + moveX * step, -bounds, bounds);
      if (!hitsAnyCollider(nextX, currZ)) {
        playerRef.current.position.x = nextX;
      }

      const nextZ = THREE.MathUtils.clamp(currZ + moveZ * step, -bounds, bounds);
      if (!hitsAnyCollider(playerRef.current.position.x, nextZ)) {
        playerRef.current.position.z = nextZ;
      }

      // Broadcast updated position for prop proximity checks
      playerPosition.x = playerRef.current.position.x;
      playerPosition.z = playerRef.current.position.z;

      const targetAngle = Math.atan2(moveX, moveZ);
      targetQuat.setFromAxisAngle(UP_AXIS, targetAngle);
      playerRef.current.quaternion.slerp(targetQuat, 0.15);
    }

    // 2. Smoothly follow the player with the camera
    desiredCamPos.copy(playerRef.current.position).add(CAMERA_OFFSET);
    state.camera.position.lerp(desiredCamPos, 0.08);

    lookTarget.set(
      playerRef.current.position.x,
      playerRef.current.position.y + 1.3,
      playerRef.current.position.z
    );
    state.camera.lookAt(lookTarget);
  });

  return (
    <group ref={playerRef}>
      <RobloxAvatar
        {...avatarProps}
        animation={isMoving ? "walk" : animation}
      />
    </group>
  );
}