import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RobloxAvatar } from "./RobloxAvatar";
import {
  joystickInput,
  playerPosition,
  walkTarget,
  clearWalkTarget,
  colliders,
} from "../../store/useAvatarStore";

const UP_AXIS = new THREE.Vector3(0, 1, 0);
const targetQuat = new THREE.Quaternion();
const PLAYER_RADIUS = 0.45;
const camForward = new THREE.Vector3();
const camRight = new THREE.Vector3();

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
  bounds = { minX: -6.3, maxX: 6.3, minZ: -6.3, maxZ: 6.3 },
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
    playerPosition.x = 0;
    playerPosition.z = 0;
    clearWalkTarget();
    if (playerRef.current) {
      playerRef.current.position.set(0, 0, 0);
    }
  }, []);

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

    const hasJoy = Math.hypot(joystickInput.x, joystickInput.y) > 0.1;
    const rawX = hasJoy ? joystickInput.x : keyX;
    const rawZ = hasJoy ? joystickInput.y : keyZ;
    const hasManualInput = rawX !== 0 || rawZ !== 0;

    const currX = playerRef.current.position.x;
    const currZ = playerRef.current.position.z;

    let moveX = 0;
    let moveZ = 0;
    let isAutoWalk = false;
    let remainingDist = 0;

    if (hasManualInput) {
      // Manual input immediately overrides tap-to-walk
      if (walkTarget.active) clearWalkTarget();

      let normX = rawX;
      let normZ = rawZ;
      const length = Math.hypot(normX, normZ);
      if (length > 1) {
        normX /= length;
        normZ /= length;
      }

      state.camera.getWorldDirection(camForward);
      camForward.y = 0;
      if (camForward.lengthSq() < 0.0001) camForward.set(-1, 0, -1);
      camForward.normalize();

      camRight.crossVectors(camForward, UP_AXIS).normalize();

      moveX = camRight.x * normX - camForward.x * normZ;
      moveZ = camRight.z * normX - camForward.z * normZ;
    } else if (walkTarget.active) {
      const dx = walkTarget.x - currX;
      const dz = walkTarget.z - currZ;
      remainingDist = Math.hypot(dx, dz);

      if (remainingDist <= 0.08) {
        clearWalkTarget();
      } else {
        moveX = dx / remainingDist;
        moveZ = dz / remainingDist;
        isAutoWalk = true;
      }
    }

    const movingNow = moveX !== 0 || moveZ !== 0;

    if (movingNow !== wasMoving.current) {
      wasMoving.current = movingNow;
      setIsMoving(movingNow);
    }

    if (movingNow) {
      const baseStep = speed * Math.min(delta, 0.1);
      const step = isAutoWalk ? Math.min(baseStep, remainingDist) : baseStep;

      let moved = false;

      const nextX = THREE.MathUtils.clamp(
        currX + moveX * step,
        bounds.minX,
        bounds.maxX
      );
      if (!hitsAnyCollider(nextX, currZ)) {
        playerRef.current.position.x = nextX;
        if (Math.abs(nextX - currX) > 0.0001) moved = true;
      }

      const nextZ = THREE.MathUtils.clamp(
        currZ + moveZ * step,
        bounds.minZ,
        bounds.maxZ
      );
      if (!hitsAnyCollider(playerRef.current.position.x, nextZ)) {
        playerRef.current.position.z = nextZ;
        if (Math.abs(nextZ - currZ) > 0.0001) moved = true;
      }

      // Stop auto-walk cleanly if blocked by furniture/NPC
      if (isAutoWalk && !moved) {
        clearWalkTarget();
        wasMoving.current = false;
        setIsMoving(false);
        return;
      }

      playerPosition.x = playerRef.current.position.x;
      playerPosition.z = playerRef.current.position.z;

      const targetAngle = Math.atan2(moveX, moveZ);
      targetQuat.setFromAxisAngle(UP_AXIS, targetAngle);
      playerRef.current.quaternion.slerp(targetQuat, 0.15);
    }
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