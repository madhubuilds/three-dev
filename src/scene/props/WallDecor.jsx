import * as THREE from "three";

const shelfGeo = new THREE.BoxGeometry(1.6, 0.09, 0.42);
const bookTallGeo = new THREE.BoxGeometry(0.14, 0.44, 0.3);
const bookShortGeo = new THREE.BoxGeometry(0.14, 0.36, 0.28);
const clockGeo = new THREE.BoxGeometry(0.48, 0.2, 0.16);

// Neon cloud outline segments
const cloudBaseGeo = new THREE.BoxGeometry(0.95, 0.06, 0.06);
const cloudLeftGeo = new THREE.BoxGeometry(0.42, 0.06, 0.06);
const cloudRightGeo = new THREE.BoxGeometry(0.38, 0.06, 0.06);
const cloudTopBigGeo = new THREE.BoxGeometry(0.46, 0.06, 0.06);
const cloudTopSmallGeo = new THREE.BoxGeometry(0.34, 0.06, 0.06);

function NeonCloud({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      {/* Bottom bar */}
      <mesh geometry={cloudBaseGeo} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#FFFDF7"
          emissive="#FFBE6B"
          emissiveIntensity={2.2}
          toneMapped={false}
        />
      </mesh>
      {/* Left slope */}
      <mesh geometry={cloudLeftGeo} position={[-0.36, 0.16, 0]} rotation={[0, 0, 0.95]}>
        <meshStandardMaterial
          color="#FFFDF7"
          emissive="#FFBE6B"
          emissiveIntensity={2.2}
          toneMapped={false}
        />
      </mesh>
      {/* Main upper-left hump */}
      <mesh geometry={cloudTopBigGeo} position={[-0.08, 0.34, 0]} rotation={[0, 0, 0.12]}>
        <meshStandardMaterial
          color="#FFFDF7"
          emissive="#FFBE6B"
          emissiveIntensity={2.2}
          toneMapped={false}
        />
      </mesh>
      {/* Secondary upper-right hump */}
      <mesh geometry={cloudTopSmallGeo} position={[0.24, 0.26, 0]} rotation={[0, 0, -0.25]}>
        <meshStandardMaterial
          color="#FFFDF7"
          emissive="#FFBE6B"
          emissiveIntensity={2.2}
          toneMapped={false}
        />
      </mesh>
      {/* Right slope */}
      <mesh geometry={cloudRightGeo} position={[0.42, 0.12, 0]} rotation={[0, 0, -1.1]}>
        <meshStandardMaterial
          color="#FFFDF7"
          emissive="#FFBE6B"
          emissiveIntensity={2.2}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

export function WallDecor() {
  return (
    <group position={[0, 0, -6.95]}>
      {/* Lower Floating Shelf + Glowing Digital Clock */}
      <group position={[0.2, 2.35, 0.21]}>
        <mesh geometry={shelfGeo} castShadow receiveShadow>
          <meshStandardMaterial color="#9E5326" roughness={0.8} />
        </mesh>
        <mesh geometry={bookTallGeo} position={[-0.55, 0.26, -0.02]} castShadow>
          <meshStandardMaterial color="#FFE600" roughness={0.8} />
        </mesh>
        <mesh geometry={bookShortGeo} position={[-0.39, 0.22, -0.02]} castShadow>
          <meshStandardMaterial color="#17233F" roughness={0.8} />
        </mesh>
        {/* Glowing Warm Desk Clock */}
        <mesh geometry={clockGeo} position={[0.35, 0.14, 0.02]}>
          <meshStandardMaterial
            color="#FFFDF7"
            emissive="#FFB35C"
            emissiveIntensity={1.8}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* Upper Floating Shelf + Books */}
      <group position={[1.1, 3.1, 0.21]}>
        <mesh geometry={shelfGeo} castShadow receiveShadow>
          <meshStandardMaterial color="#9E5326" roughness={0.8} />
        </mesh>
        <mesh geometry={bookTallGeo} position={[0.35, 0.26, -0.02]} castShadow>
          <meshStandardMaterial color="#FF5A1F" roughness={0.8} />
        </mesh>
        <mesh geometry={bookTallGeo} position={[0.51, 0.26, -0.02]} castShadow>
          <meshStandardMaterial color="#F5D7B5" roughness={0.8} />
        </mesh>
        <mesh geometry={bookShortGeo} position={[0.67, 0.22, -0.02]} rotation={[0, 0, -0.15]} castShadow>
          <meshStandardMaterial color="#080808" roughness={0.8} />
        </mesh>
      </group>

      {/* Warm Glowing Neon Cloud Signs */}
      <NeonCloud position={[3.3, 2.55, 0.04]} scale={1} />
      <NeonCloud position={[4.55, 2.15, 0.04]} scale={0.82} />
    </group>
  );
}