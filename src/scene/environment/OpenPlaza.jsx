import * as THREE from "three";
import { useCollider } from "../hooks/useCollider";

// Shared Geometries
const plazaBaseGeo = new THREE.BoxGeometry(18.0, 0.4, 18.0);
const centerPadGeo = new THREE.CylinderGeometry(3.2, 3.2, 0.025, 36);
const centerRingGeo = new THREE.RingGeometry(3.2, 3.5, 36);

const curbHorizontalGeo = new THREE.BoxGeometry(18.2, 0.36, 0.35);
const curbVerticalGeo = new THREE.BoxGeometry(0.35, 0.36, 18.2);

const trunkGeo = new THREE.CylinderGeometry(0.18, 0.24, 1.1, 12);
const foliageLowGeo = new THREE.BoxGeometry(1.45, 0.9, 1.45);
const foliageTopGeo = new THREE.BoxGeometry(0.95, 0.85, 0.95);

const postGeo = new THREE.BoxGeometry(0.24, 1.1, 0.24);
const lanternGeo = new THREE.BoxGeometry(0.3, 0.28, 0.3);

function PlazaTree({ id, position }) {
  useCollider(id, position[0], position[2], 0.55, 0.55);

  return (
    <group position={position}>
      <mesh geometry={trunkGeo} position={[0, 0.55, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#7C4722" roughness={0.9} />
      </mesh>
      <mesh geometry={foliageLowGeo} position={[0, 1.35, 0]} castShadow>
        <meshStandardMaterial color="#2D6A4F" roughness={0.85} />
      </mesh>
      <mesh
        geometry={foliageTopGeo}
        position={[0, 2.05, 0]}
        rotation={[0, Math.PI / 4, 0]}
        castShadow
      >
        <meshStandardMaterial color="#40916C" roughness={0.85} />
      </mesh>
    </group>
  );
}

function PlazaLantern({ id, position }) {
  useCollider(id, position[0], position[2], 0.25, 0.25);

  return (
    <group position={position}>
      <mesh geometry={postGeo} position={[0, 0.55, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#17233F" roughness={0.8} />
      </mesh>
      <mesh geometry={lanternGeo} position={[0, 1.24, 0]}>
        <meshStandardMaterial
          color="#FFFDF7"
          emissive="#FFBE6B"
          emissiveIntensity={2.2}
          toneMapped={false}
        />
      </mesh>
      <pointLight
        position={[0, 1.5, 0]}
        intensity={2.6}
        distance={6}
        decay={2}
        color="#FFAD5C"
      />
    </group>
  );
}

export function OpenPlaza() {
  return (
    <group>
      <color attach="background" args={["#C8986B"]} />

      {/* Main Courtyard Slab centered at [0, 0, 0] */}
      <mesh geometry={plazaBaseGeo} position={[0, -0.2, 0]} receiveShadow>
        <meshStandardMaterial color="#D6B894" roughness={0.88} />
      </mesh>

      {/* Central Gathering Stone Circle (NPC Hangout Zone) */}
      <mesh geometry={centerPadGeo} position={[0, 0.012, 0]} receiveShadow>
        <meshStandardMaterial color="#EAD2B7" roughness={0.9} />
      </mesh>
      <mesh
        geometry={centerRingGeo}
        position={[0, 0.026, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial color="#9E5326" roughness={0.85} />
      </mesh>

      {/* Low Perimeter Curbs on All 4 Sides */}
      <mesh geometry={curbHorizontalGeo} position={[0, 0.18, -8.9]} castShadow receiveShadow>
        <meshStandardMaterial color="#9E5326" roughness={0.85} />
      </mesh>
      <mesh geometry={curbHorizontalGeo} position={[0, 0.18, 8.9]} castShadow receiveShadow>
        <meshStandardMaterial color="#9E5326" roughness={0.85} />
      </mesh>
      <mesh geometry={curbVerticalGeo} position={[-8.9, 0.18, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#9E5326" roughness={0.85} />
      </mesh>
      <mesh geometry={curbVerticalGeo} position={[8.9, 0.18, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#9E5326" roughness={0.85} />
      </mesh>

      {/* Corner Trees & Warm Lanterns */}
      <PlazaTree id="plaza-tree-nw" position={[-7.2, 0, -7.2]} />
      <PlazaTree id="plaza-tree-ne" position={[7.2, 0, -7.2]} />
      <PlazaTree id="plaza-tree-sw" position={[-7.2, 0, 7.2]} />
      <PlazaTree id="plaza-tree-se" position={[7.2, 0, 7.2]} />

      <PlazaLantern id="plaza-lantern-1" position={[-4.2, 0, -4.2]} />
      <PlazaLantern id="plaza-lantern-2" position={[4.2, 0, -4.2]} />
    </group>
  );
}