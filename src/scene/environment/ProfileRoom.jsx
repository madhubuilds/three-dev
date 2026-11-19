import { useMemo } from "react";
import * as THREE from "three";
import { useAvatarStore } from "../../store/useAvatarStore";

const ROOM_THEMES = {
  cozy: {
    bg: "#C8986B",
    floor: "#7C4722",
    seam: "#4A250E",
    wall: "#F5D7B5",
    trim: "#9E5326",
    rug: "#E2B48A",
    curtain: "#FFF6E8",
  },
  studio: {
    bg: "#E2E2DC",
    floor: "#D4D4CE",
    seam: "#B5B5AE",
    wall: "#FFFFFF",
    trim: "#080808",
    rug: "#FFE600",
    curtain: "#F4F4F0",
  },
  midnight: {
    bg: "#090D16",
    floor: "#1E293B",
    seam: "#0F172A",
    wall: "#0F172A",
    trim: "#FF5A1F",
    rug: "#FFE600",
    curtain: "#1E293B",
  },
};

const floorGeo = new THREE.BoxGeometry(14.6, 0.4, 14.6);
const rowSeamGeo = new THREE.BoxGeometry(14.3, 0.008, 0.05);
const colSeamGeo = new THREE.BoxGeometry(0.05, 0.008, 1.45);

const northWallGeo = new THREE.BoxGeometry(14.8, 4.2, 0.45);
const westWallGeo = new THREE.BoxGeometry(0.45, 4.2, 14.8);
const northCapGeo = new THREE.BoxGeometry(15.0, 0.22, 0.65);
const westCapGeo = new THREE.BoxGeometry(0.65, 0.22, 15.0);
const northTrimGeo = new THREE.BoxGeometry(14.4, 0.22, 0.1);
const westTrimGeo = new THREE.BoxGeometry(0.1, 0.22, 14.4);

const rugGeo = new THREE.CylinderGeometry(2.3, 2.3, 0.05, 36);
const windowFrameGeo = new THREE.BoxGeometry(0.14, 2.1, 3.0);
const windowGlassGeo = new THREE.BoxGeometry(0.16, 1.8, 2.6);
const mullionVGeo = new THREE.BoxGeometry(0.19, 1.85, 0.08);
const mullionHGeo = new THREE.BoxGeometry(0.19, 0.08, 2.65);
const curtainRodGeo = new THREE.CylinderGeometry(0.04, 0.04, 3.8, 12);
const curtainPanelGeo = new THREE.BoxGeometry(0.18, 2.35, 0.65);

export function ProfileRoom() {
  const roomTheme = useAvatarStore((s) => s.roomTheme);
  const theme = ROOM_THEMES[roomTheme] || ROOM_THEMES.cozy;

  // Precompute floorboard groove lines once
  const { rowZ, crossJoints } = useMemo(() => {
    const rows = [];
    const joints = [];
    let rowIdx = 0;

    for (let z = -6.3; z <= 6.3; z += 1.45) {
      rows.push(Number(z.toFixed(2)));
      const offset = rowIdx % 2 === 0 ? 0 : 1.8;
      for (let x = -5.4 + offset; x <= 6.2; x += 3.6) {
        joints.push([Number(x.toFixed(2)), Number((z + 0.725).toFixed(2))]);
      }
      rowIdx++;
    }
    return { rowZ: rows, crossJoints: joints };
  }, []);
  return (
    <group>
      <color attach="background" args={[theme.bg]} />

      {/* Main Floor Slab */}
      <mesh geometry={floorGeo} position={[0, -0.2, 0]} receiveShadow>
        <meshStandardMaterial color={theme.floor} roughness={0.85} />
      </mesh>

      {/* Floor Plank Grooves */}
      {rowZ.map((z) => (
        <mesh
          key={`r-${z}`}
          geometry={rowSeamGeo}
          position={[0, 0.004, z]}
          receiveShadow
        >
          <meshStandardMaterial color={theme.seam} roughness={0.9} />
        </mesh>
      ))}
      {crossJoints.map(([x, z], i) => (
        <mesh
          key={`c-${i}`}
          geometry={colSeamGeo}
          position={[x, 0.004, z]}
          receiveShadow
        >
          <meshStandardMaterial color={theme.seam} roughness={0.9} />
        </mesh>
      ))}

      {/* Circular Diorama Rug (sits cleanly over seams) */}
      <mesh geometry={rugGeo} position={[0.4, 0.03, 0.8]} receiveShadow>
        <meshStandardMaterial color={theme.rug} roughness={0.9} />
      </mesh>

      {/* North (Back-Right) Wall + Top Cap + Baseboard */}
      <mesh
        geometry={northWallGeo}
        position={[0, 2.1, -7.2]}
        receiveShadow
        castShadow
      >
        <meshStandardMaterial color={theme.wall} roughness={0.85} />
      </mesh>
      <mesh geometry={northCapGeo} position={[0, 4.25, -7.2]} castShadow>
        <meshStandardMaterial color={theme.trim} roughness={0.8} />
      </mesh>
      <mesh geometry={northTrimGeo} position={[0, 0.11, -6.96]}>
        <meshStandardMaterial color={theme.trim} roughness={0.8} />
      </mesh>

      {/* West (Back-Left) Wall + Top Cap + Baseboard */}
      <mesh
        geometry={westWallGeo}
        position={[-7.2, 2.1, 0]}
        receiveShadow
        castShadow
      >
        <meshStandardMaterial color={theme.wall} roughness={0.85} />
      </mesh>
      <mesh geometry={westCapGeo} position={[-7.2, 4.25, 0]} castShadow>
        <meshStandardMaterial color={theme.trim} roughness={0.8} />
      </mesh>
      <mesh geometry={westTrimGeo} position={[-6.96, 0.11, 0]}>
        <meshStandardMaterial color={theme.trim} roughness={0.8} />
      </mesh>

      {/* Window with Cross-Bars & Curtains on Left Wall */}
      <group position={[-6.96, 2.35, -1.6]}>
        <mesh geometry={windowFrameGeo}>
          <meshStandardMaterial color={theme.trim} roughness={0.8} />
        </mesh>
        <mesh geometry={windowGlassGeo}>
          <meshStandardMaterial
            color="#FFF3D6"
            emissive="#FFD89B"
            emissiveIntensity={0.65}
          />
        </mesh>

        {/* Window Cross-Bars (Mullions) */}
        <mesh geometry={mullionVGeo} position={[0, 0, -0.45]}>
          <meshStandardMaterial color={theme.trim} roughness={0.8} />
        </mesh>
        <mesh geometry={mullionVGeo} position={[0, 0, 0.45]}>
          <meshStandardMaterial color={theme.trim} roughness={0.8} />
        </mesh>
        <mesh geometry={mullionHGeo} position={[0, 0, 0]}>
          <meshStandardMaterial color={theme.trim} roughness={0.8} />
        </mesh>

        {/* Curtain Rod & Panels */}
        <mesh
          geometry={curtainRodGeo}
          position={[0.14, 1.22, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          castShadow
        >
          <meshStandardMaterial color="#080808" roughness={0.5} />
        </mesh>
        <mesh geometry={curtainPanelGeo} position={[0.14, 0, -1.35]} castShadow>
          <meshStandardMaterial color={theme.curtain} roughness={0.95} />
        </mesh>
        <mesh geometry={curtainPanelGeo} position={[0.14, 0, 1.35]} castShadow>
          <meshStandardMaterial color={theme.curtain} roughness={0.95} />
        </mesh>
      </group>
    </group>
  );
}
