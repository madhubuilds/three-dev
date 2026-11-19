import * as THREE from "three";

// Shared geometries
const eyeDotGeo = new THREE.BoxGeometry(0.09, 0.11, 0.04);
const eyeSlitGeo = new THREE.BoxGeometry(0.13, 0.04, 0.04);
const eyeCyberGeo = new THREE.BoxGeometry(0.14, 0.07, 0.04);

const noseButtonGeo = new THREE.BoxGeometry(0.08, 0.08, 0.08);
const noseBlockyGeo = new THREE.BoxGeometry(0.12, 0.14, 0.1);
const noseLongGeo = new THREE.BoxGeometry(0.08, 0.16, 0.14);
const noseRoundGeo = new THREE.SphereGeometry(0.06, 12, 12);

const mouthBarGeo = new THREE.BoxGeometry(0.22, 0.04, 0.04);
const mouthOpenGeo = new THREE.BoxGeometry(0.16, 0.11, 0.04);

const stacheMainGeo = new THREE.BoxGeometry(0.28, 0.07, 0.05);
const stacheTipGeo = new THREE.BoxGeometry(0.08, 0.05, 0.05);
const stacheWalrusGeo = new THREE.BoxGeometry(0.32, 0.11, 0.06);
const goateeGeo = new THREE.BoxGeometry(0.14, 0.12, 0.05);

export function AvatarFace({
  eyes = "classic",
  nose = "button",
  mouth = "smile",
  mustache = "none",
  skinColor = "#FFE600",
  hairColor = "#080808",
}) {
  return (
    <group position={[0, 0, 0.31]}>
      {/* EYES */}
      {eyes === "classic" && (
        <>
          <mesh geometry={eyeDotGeo} position={[-0.13, 0.07, 0]}>
            <meshStandardMaterial color="#080808" />
          </mesh>
          <mesh geometry={eyeDotGeo} position={[0.13, 0.07, 0]}>
            <meshStandardMaterial color="#080808" />
          </mesh>
        </>
      )}
      {eyes === "happy" && (
        <>
          <mesh geometry={eyeSlitGeo} position={[-0.13, 0.08, 0]} rotation={[0, 0, 0.15]}>
            <meshStandardMaterial color="#080808" />
          </mesh>
          <mesh geometry={eyeSlitGeo} position={[0.13, 0.08, 0]} rotation={[0, 0, -0.15]}>
            <meshStandardMaterial color="#080808" />
          </mesh>
        </>
      )}
      {eyes === "angry" && (
        <>
          <mesh geometry={eyeSlitGeo} position={[-0.13, 0.08, 0]} rotation={[0, 0, -0.25]}>
            <meshStandardMaterial color="#080808" />
          </mesh>
          <mesh geometry={eyeSlitGeo} position={[0.13, 0.08, 0]} rotation={[0, 0, 0.25]}>
            <meshStandardMaterial color="#080808" />
          </mesh>
        </>
      )}
      {eyes === "cyber" && (
        <>
          <mesh geometry={eyeCyberGeo} position={[-0.13, 0.07, 0]}>
            <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={0.8} />
          </mesh>
          <mesh geometry={eyeCyberGeo} position={[0.13, 0.07, 0]}>
            <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={0.8} />
          </mesh>
        </>
      )}

      {/* NOSE */}
      {nose === "button" && (
        <mesh geometry={noseButtonGeo} position={[0, -0.02, 0.02]}>
          <meshStandardMaterial color={skinColor} />
        </mesh>
      )}
      {nose === "blocky" && (
        <mesh geometry={noseBlockyGeo} position={[0, -0.02, 0.03]}>
          <meshStandardMaterial color={skinColor} />
        </mesh>
      )}
      {nose === "long" && (
        <mesh geometry={noseLongGeo} position={[0, -0.03, 0.05]}>
          <meshStandardMaterial color={skinColor} />
        </mesh>
      )}
      {nose === "round" && (
        <mesh geometry={noseRoundGeo} position={[0, -0.02, 0.03]}>
          <meshStandardMaterial color="#FF5A1F" />
        </mesh>
      )}

      {/* MOUTH */}
      {mouth === "smile" && (
        <mesh geometry={mouthBarGeo} position={[0, -0.16, 0]}>
          <meshStandardMaterial color="#080808" />
        </mesh>
      )}
      {mouth === "neutral" && (
        <mesh geometry={mouthBarGeo} position={[0, -0.16, 0]} scale={[0.7, 0.8, 1]}>
          <meshStandardMaterial color="#080808" />
        </mesh>
      )}
      {mouth === "open" && (
        <mesh geometry={mouthOpenGeo} position={[0, -0.16, 0]}>
          <meshStandardMaterial color="#080808" />
        </mesh>
      )}
      {mouth === "smirk" && (
        <mesh geometry={mouthBarGeo} position={[0.03, -0.15, 0]} rotation={[0, 0, 0.18]} scale={[0.8, 1, 1]}>
          <meshStandardMaterial color="#080808" />
        </mesh>
      )}

      {/* MUSTACHE / FACIAL HAIR */}
      {mustache === "classic" && (
        <mesh geometry={stacheMainGeo} position={[0, -0.1, 0.02]}>
          <meshStandardMaterial color={hairColor} />
        </mesh>
      )}
      {mustache === "handlebar" && (
        <group position={[0, -0.1, 0.02]}>
          <mesh geometry={stacheMainGeo}>
            <meshStandardMaterial color={hairColor} />
          </mesh>
          <mesh geometry={stacheTipGeo} position={[-0.16, 0.03, 0]} rotation={[0, 0, 0.6]}>
            <meshStandardMaterial color={hairColor} />
          </mesh>
          <mesh geometry={stacheTipGeo} position={[0.16, 0.03, 0]} rotation={[0, 0, -0.6]}>
            <meshStandardMaterial color={hairColor} />
          </mesh>
        </group>
      )}
      {mustache === "walrus" && (
        <mesh geometry={stacheWalrusGeo} position={[0, -0.11, 0.03]}>
          <meshStandardMaterial color={hairColor} />
        </mesh>
      )}
      {mustache === "goatee" && (
        <group position={[0, 0, 0.02]}>
          <mesh geometry={stacheMainGeo} position={[0, -0.1, 0]} scale={[0.85, 0.8, 1]}>
            <meshStandardMaterial color={hairColor} />
          </mesh>
          <mesh geometry={goateeGeo} position={[0, -0.24, 0]}>
            <meshStandardMaterial color={hairColor} />
          </mesh>
        </group>
      )}
    </group>
  );
}