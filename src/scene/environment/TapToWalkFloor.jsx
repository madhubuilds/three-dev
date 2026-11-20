import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  setWalkTarget,
  useAvatarStore,
  walkTarget,
} from "../../store/useAvatarStore";

const outerRingGeo = new THREE.RingGeometry(0.28, 0.38, 32);
const innerDotGeo = new THREE.CircleGeometry(0.11, 24);

export function TapToWalkFloor({
  bounds = { minX: -6.3, maxX: 6.3, minZ: -6.3, maxZ: 6.3 },
}) {
  const markerRef = useRef();

  const width = bounds.maxX - bounds.minX;
  const depth = bounds.maxZ - bounds.minZ;
  const centerX = (bounds.minX + bounds.maxX) / 2;
  const centerZ = (bounds.minZ + bounds.maxZ) / 2;

  useFrame(({ clock }) => {
    const marker = markerRef.current;
    if (!marker) return;

    if (!walkTarget.active) {
      marker.visible = false;
      return;
    }

    marker.visible = true;
    marker.position.set(walkTarget.x, 0.03, walkTarget.z);

    const pulse = 1 + 0.14 * Math.sin(clock.elapsedTime * 7);
    marker.scale.set(pulse, pulse, 1);
  });

  const handleFloorClick = (e) => {
    // Ignore pointer releases that were camera pan/orbit drags
    if (e.delta > 5) return;
    // Do not walk when decorating room furniture
    if (useAvatarStore.getState().isDecorating) return;

    e.stopPropagation();

    const targetX = THREE.MathUtils.clamp(e.point.x, bounds.minX, bounds.maxX);
    const targetZ = THREE.MathUtils.clamp(e.point.z, bounds.minZ, bounds.maxZ);
    setWalkTarget(targetX, targetZ);
  };

  return (
    <group>
      {/* Invisible Raycast Catcher Flush with Floor */}
      <mesh
        position={[centerX, 0.015, centerZ]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={handleFloorClick}
      >
        <planeGeometry args={[width, depth]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Pulsing Destination Ring */}
      <group
        ref={markerRef}
        visible={false}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.03, 0]}
      >
        <mesh geometry={outerRingGeo}>
          <meshBasicMaterial color="#FF5A1F" transparent opacity={0.9} />
        </mesh>
        <mesh geometry={innerDotGeo} position={[0, 0, 0.002]}>
          <meshBasicMaterial color="#FFE600" transparent opacity={0.95} />
        </mesh>
      </group>
    </group>
  );
}