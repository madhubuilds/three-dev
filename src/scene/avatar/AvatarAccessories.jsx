import * as THREE from "three";

// Hair geometries
const hairTopGeo = new THREE.BoxGeometry(0.66, 0.16, 0.66);
const hairBackGeo = new THREE.BoxGeometry(0.66, 0.42, 0.14);
const hairBangsGeo = new THREE.BoxGeometry(0.66, 0.12, 0.12);
const spikeGeo = new THREE.BoxGeometry(0.16, 0.24, 0.16);
const mohawkGeo = new THREE.BoxGeometry(0.16, 0.28, 0.68);
const bobSideGeo = new THREE.BoxGeometry(0.14, 0.48, 0.62);
const afroGeo = new THREE.BoxGeometry(0.84, 0.48, 0.84);

// Hat geometries
const capCrownGeo = new THREE.BoxGeometry(0.68, 0.2, 0.68);
const capVisorGeo = new THREE.BoxGeometry(0.68, 0.07, 0.32);
const beanieBaseGeo = new THREE.BoxGeometry(0.7, 0.16, 0.7);
const beanieTopGeo = new THREE.BoxGeometry(0.64, 0.22, 0.64);
const tophatBrimGeo = new THREE.BoxGeometry(0.88, 0.06, 0.88);
const tophatCylGeo = new THREE.BoxGeometry(0.56, 0.44, 0.56);
const crownBaseGeo = new THREE.BoxGeometry(0.66, 0.16, 0.66);
const crownSpikeGeo = new THREE.BoxGeometry(0.12, 0.16, 0.12);

// Glasses geometries
const lensGeo = new THREE.BoxGeometry(0.2, 0.13, 0.05);
const bridgeGeo = new THREE.BoxGeometry(0.12, 0.04, 0.05);
const visorGlassGeo = new THREE.BoxGeometry(0.56, 0.16, 0.08);

export function Hair({ type = "classic", color = "#080808" }) {
  if (type === "none") return null;

  if (type === "spiky") {
    return (
      <group>
        <mesh geometry={hairTopGeo} position={[0, 0.31, 0]} castShadow>
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh
          geometry={spikeGeo}
          position={[-0.18, 0.44, 0.1]}
          rotation={[0.2, 0, 0.25]}
          castShadow
        >
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh
          geometry={spikeGeo}
          position={[0, 0.47, 0]}
          rotation={[-0.1, 0, 0]}
          castShadow
        >
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh
          geometry={spikeGeo}
          position={[0.18, 0.44, -0.08]}
          rotation={[-0.2, 0, -0.25]}
          castShadow
        >
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
    );
  }

  if (type === "mohawk") {
    return (
      <mesh geometry={mohawkGeo} position={[0, 0.42, 0]} castShadow>
        <meshStandardMaterial color={color} />
      </mesh>
    );
  }

  if (type === "bob") {
    return (
      <group>
        <mesh geometry={hairTopGeo} position={[0, 0.31, 0]} castShadow>
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh geometry={hairBackGeo} position={[0, 0.04, -0.28]} castShadow>
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh geometry={bobSideGeo} position={[-0.3, 0.05, -0.02]} castShadow>
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh geometry={bobSideGeo} position={[0.3, 0.05, -0.02]} castShadow>
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
    );
  }

  if (type === "afro") {
    return (
      <mesh geometry={afroGeo} position={[0, 0.42, -0.02]} castShadow>
        <meshStandardMaterial color={color} />
      </mesh>
    );
  }

  // Default: classic
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

export function Hat({ type = "none" }) {
  if (type === "cap") {
    return (
      <group position={[0, 0.38, 0]}>
        <mesh geometry={capCrownGeo} castShadow>
          <meshStandardMaterial color="#FF5A1F" />
        </mesh>
        <mesh geometry={capVisorGeo} position={[0, -0.06, 0.38]} castShadow>
          <meshStandardMaterial color="#080808" />
        </mesh>
      </group>
    );
  }

  if (type === "beanie") {
    return (
      <group position={[0, 0.36, 0]}>
        <mesh geometry={beanieBaseGeo} position={[0, -0.04, 0]} castShadow>
          <meshStandardMaterial color="#17233F" />
        </mesh>
        <mesh geometry={beanieTopGeo} position={[0, 0.1, 0]} castShadow>
          <meshStandardMaterial color="#FF5A1F" />
        </mesh>
      </group>
    );
  }

  if (type === "tophat") {
    return (
      <group position={[0, 0.34, 0]}>
        <mesh geometry={tophatBrimGeo} castShadow>
          <meshStandardMaterial color="#080808" />
        </mesh>
        <mesh geometry={tophatCylGeo} position={[0, 0.24, 0]} castShadow>
          <meshStandardMaterial color="#080808" />
        </mesh>
      </group>
    );
  }

  if (type === "crown") {
    return (
      <group position={[0, 0.36, 0]}>
        <mesh geometry={crownBaseGeo} castShadow>
          <meshStandardMaterial
            color="#FFE600"
            metalness={0.4}
            roughness={0.2}
          />
        </mesh>
        {[-0.22, 0, 0.22].map((x) => (
          <mesh
            key={x}
            geometry={crownSpikeGeo}
            position={[x, 0.14, 0.26]}
            castShadow
          >
            <meshStandardMaterial
              color="#FFE600"
              metalness={0.4}
              roughness={0.2}
            />
          </mesh>
        ))}
      </group>
    );
  }

  return null;
}

export function Glasses({ type = "none" }) {
  if (type === "shades") {
    return (
      <group position={[0, 0.06, 0.32]}>
        <mesh geometry={lensGeo} position={[-0.14, 0, 0]}>
          <meshStandardMaterial
            color="#080808"
            roughness={0.1}
            metalness={0.6}
          />
        </mesh>
        <mesh geometry={lensGeo} position={[0.14, 0, 0]}>
          <meshStandardMaterial
            color="#080808"
            roughness={0.1}
            metalness={0.6}
          />
        </mesh>
        <mesh geometry={bridgeGeo} position={[0, 0.02, 0]}>
          <meshStandardMaterial color="#080808" />
        </mesh>
      </group>
    );
  }

  if (type === "visor") {
    return (
      <mesh geometry={visorGlassGeo} position={[0, 0.06, 0.32]}>
        <meshStandardMaterial
          color="#00E5FF"
          emissive="#00E5FF"
          emissiveIntensity={0.4}
          roughness={0.1}
        />
      </mesh>
    );
  }

  return null;
}
