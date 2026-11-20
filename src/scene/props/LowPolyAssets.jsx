import * as THREE from "three";

// --- Procedural Low-Poly Geometry Helpers ---

function createJitteredPolyGeo(radius, detail, scaleX, scaleY, scaleZ, freq = 14) {
  const base = new THREE.IcosahedronGeometry(radius, detail);
  const geo = base.toNonIndexed();
  const pos = geo.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    const vx = pos.getX(i);
    const vy = pos.getY(i);
    const vz = pos.getZ(i);
    const ripple = 1 + 0.1 * Math.sin(vx * freq + vz * (freq * 0.8) + vy * 9);
    pos.setXYZ(i, vx * scaleX * ripple, vy * scaleY * ripple, vz * scaleZ * ripple);
  }
  geo.computeVertexNormals();
  return geo;
}

function createMonsteraLeafGeo() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.18, 0.02, 0.32, 0.18, 0.28, 0.38);
  shape.bezierCurveTo(0.24, 0.54, 0.1, 0.64, 0, 0.7);
  shape.bezierCurveTo(-0.1, 0.64, -0.24, 0.54, -0.28, 0.38);
  shape.bezierCurveTo(-0.32, 0.18, -0.18, 0.02, 0, 0);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.02,
    bevelEnabled: true,
    bevelSegments: 1,
    steps: 1,
    bevelSize: 0.012,
    bevelThickness: 0.012,
    curveSegments: 4,
  });
  geo.computeVertexNormals();
  return geo;
}

function createRoundedPlankGeo(width, depth, thickness, curveSegments = 4) {
  const hw = width / 2;
  const hd = depth / 2;
  const r = Math.min(hw, hd) * 0.42;

  const shape = new THREE.Shape();
  shape.moveTo(-hw + r, -hd);
  shape.lineTo(hw - r, -hd);
  shape.quadraticCurveTo(hw, -hd, hw, -hd + r);
  shape.lineTo(hw, hd - r);
  shape.quadraticCurveTo(hw, hd, hw - r, hd);
  shape.lineTo(-hw + r, hd);
  shape.quadraticCurveTo(-hw, hd, -hw, hd - r);
  shape.lineTo(-hw, -hd + r);
  shape.quadraticCurveTo(-hw, -hd, -hw + r, -hd);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelSegments: 1,
    steps: 1,
    bevelSize: 0.03,
    bevelThickness: 0.03,
    curveSegments,
  });
  geo.rotateX(Math.PI / 2);
  geo.computeVertexNormals();
  return geo;
}

function createPebbleTopGeo() {
  const shape = new THREE.Shape();
  shape.moveTo(-0.68, -0.18);
  shape.bezierCurveTo(-0.72, 0.28, -0.18, 0.46, 0.32, 0.36);
  shape.bezierCurveTo(0.76, 0.26, 0.78, -0.22, 0.36, -0.38);
  shape.bezierCurveTo(-0.08, -0.5, -0.64, -0.44, -0.68, -0.18);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.06,
    bevelEnabled: true,
    bevelSegments: 1,
    steps: 1,
    bevelSize: 0.025,
    bevelThickness: 0.025,
    curveSegments: 5,
  });
  geo.rotateX(Math.PI / 2);
  geo.computeVertexNormals();
  return geo;
}

// --- Shared Module-Level Geometries ---

// 1. Faceted Monstera
const potBodyGeo = new THREE.CylinderGeometry(0.28, 0.21, 0.36, 7);
const potRimGeo = new THREE.CylinderGeometry(0.31, 0.3, 0.07, 7);
const soilGeo = createJitteredPolyGeo(0.24, 1, 1, 0.42, 1, 18);
const stemGeo = new THREE.CylinderGeometry(0.016, 0.024, 0.44, 5);
const leafGeo = createMonsteraLeafGeo();

const LEAF_CLUSTERS = [
  { pos: [0, 0.56, 0.04], stemRot: [0.35, 0, 0], leafRot: [0.85, 0, 0], scale: 0.85, dark: false },
  { pos: [0.12, 0.64, -0.05], stemRot: [-0.25, 0.4, -0.38], leafRot: [0.65, 1.3, -0.2], scale: 0.95, dark: true },
  { pos: [-0.13, 0.62, -0.04], stemRot: [-0.2, -0.4, 0.4], leafRot: [0.7, -1.35, 0.2], scale: 0.9, dark: false },
  { pos: [0.05, 0.72, -0.11], stemRot: [-0.42, 0.2, -0.15], leafRot: [0.48, 2.8, 0.1], scale: 1.0, dark: true },
  { pos: [-0.04, 0.76, 0.02], stemRot: [0.12, -0.2, 0.12], leafRot: [0.42, -0.35, -0.1], scale: 0.78, dark: false },
];

// 2. Cloud Lounger (Low-Poly Sofa)
const cloudBaseGeo = createRoundedPlankGeo(1.95, 0.86, 0.14, 4);
const cloudCushionGeo = createRoundedPlankGeo(0.88, 0.74, 0.18, 4);
const cloudBackGeo = createRoundedPlankGeo(1.92, 0.24, 0.46, 4);
const cloudArmGeo = createRoundedPlankGeo(0.24, 0.82, 0.34, 4);
const sofaLegGeo = new THREE.CylinderGeometry(0.045, 0.03, 0.18, 5);
const throwPillowGeo = createJitteredPolyGeo(0.22, 1, 1.1, 0.95, 0.45, 12);

// 3. Pebble Pouf (Low-Poly Ottoman)
const poufBodyGeo = createJitteredPolyGeo(0.46, 1, 1.05, 0.68, 1.05, 11);
const poufRingGeo = new THREE.CylinderGeometry(0.36, 0.38, 0.08, 8);

// 4. Sculpted Bonsai (Low-Poly Zen Tree)
const bonsaiTrayGeo = new THREE.CylinderGeometry(0.38, 0.31, 0.14, 6);
const bonsaiSoilGeo = createJitteredPolyGeo(0.3, 1, 1, 0.25, 1, 16);
const bonsaiTrunkLowGeo = new THREE.CylinderGeometry(0.055, 0.085, 0.34, 5);
const bonsaiTrunkMidGeo = new THREE.CylinderGeometry(0.04, 0.058, 0.32, 5);
const bonsaiPadLargeGeo = createJitteredPolyGeo(0.26, 1, 1.25, 0.48, 1.1, 13);
const bonsaiPadSmallGeo = createJitteredPolyGeo(0.19, 1, 1.2, 0.46, 1.05, 15);

// 5. Crystal Prism Lamp
const crystalBaseGeo = new THREE.CylinderGeometry(0.22, 0.27, 0.14, 6);
const crystalCollarGeo = new THREE.CylinderGeometry(0.17, 0.21, 0.07, 6);
const crystalShardMainGeo = new THREE.CylinderGeometry(0.02, 0.18, 0.68, 6);
const crystalShardSideGeo = new THREE.CylinderGeometry(0.015, 0.11, 0.44, 5);

// 6. Faceted Shroom Lamp
const shroomBaseGeo = new THREE.CylinderGeometry(0.12, 0.18, 0.38, 7);
const shroomCapGeo = new THREE.ConeGeometry(0.38, 0.28, 7);
const shroomGlowGeo = new THREE.CylinderGeometry(0.33, 0.14, 0.06, 7);

// 7. Pebble Tea Table
const pebbleTopGeo = createPebbleTopGeo();
const tableLegGeo = new THREE.CylinderGeometry(0.045, 0.028, 0.42, 5);
const teapotBodyGeo = new THREE.DodecahedronGeometry(0.11, 0);
const teapotLidGeo = new THREE.ConeGeometry(0.06, 0.05, 5);

// 8. Compact DJ Deck
const djStandGeo = createRoundedPlankGeo(1.38, 0.62, 0.72, 3);
const djDeckTopGeo = new THREE.BoxGeometry(1.3, 0.06, 0.54);
const platterGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.03, 8);
const eqBarGeo = new THREE.BoxGeometry(0.045, 0.02, 0.14);

// --- Low-Poly Components ---

export function FacetedMonstera() {
  return (
    <group>
      <mesh geometry={potBodyGeo} position={[0, 0.18, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#C8643B" roughness={0.82} flatShading />
      </mesh>
      <mesh geometry={potRimGeo} position={[0, 0.365, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#D97448" roughness={0.8} flatShading />
      </mesh>
      <mesh geometry={soilGeo} position={[0, 0.37, 0]} receiveShadow>
        <meshStandardMaterial color="#4A3222" roughness={0.95} flatShading />
      </mesh>
      {LEAF_CLUSTERS.map((item, idx) => (
        <group key={idx}>
          <mesh
            geometry={stemGeo}
            position={[item.pos[0] * 0.5, 0.48, item.pos[2] * 0.5]}
            rotation={item.stemRot}
            castShadow
          >
            <meshStandardMaterial color="#275B43" roughness={0.85} flatShading />
          </mesh>
          <mesh
            geometry={leafGeo}
            position={item.pos}
            rotation={item.leafRot}
            scale={item.scale}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial
              color={item.dark ? "#2D6A4F" : "#40916C"}
              roughness={0.72}
              flatShading
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function CloudLounger() {
  return (
    <group>
      {/* 4 Tapered Oak Legs */}
      {[
        [-0.78, -0.32],
        [0.78, -0.32],
        [-0.78, 0.32],
        [0.78, 0.32],
      ].map(([lx, lz], i) => (
        <mesh key={i} geometry={sofaLegGeo} position={[lx, 0.09, lz]} castShadow>
          <meshStandardMaterial color="#8B5A2B" roughness={0.8} flatShading />
        </mesh>
      ))}

      {/* Wooden Frame Base */}
      <mesh geometry={cloudBaseGeo} position={[0, 0.24, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#A46B39" roughness={0.82} flatShading />
      </mesh>

      {/* Dual Plump Cushions */}
      <mesh geometry={cloudCushionGeo} position={[-0.45, 0.39, 0.05]} castShadow receiveShadow>
        <meshStandardMaterial color="#FAF3EB" roughness={0.88} flatShading />
      </mesh>
      <mesh geometry={cloudCushionGeo} position={[0.45, 0.39, 0.05]} castShadow receiveShadow>
        <meshStandardMaterial color="#FAF3EB" roughness={0.88} flatShading />
      </mesh>

      {/* Curved Backrest & Side Bolsters */}
      <mesh geometry={cloudBackGeo} position={[0, 0.56, -0.31]} castShadow receiveShadow>
        <meshStandardMaterial color="#F2E4D5" roughness={0.88} flatShading />
      </mesh>
      <mesh geometry={cloudArmGeo} position={[-0.86, 0.48, 0.02]} castShadow receiveShadow>
        <meshStandardMaterial color="#F2E4D5" roughness={0.88} flatShading />
      </mesh>
      <mesh geometry={cloudArmGeo} position={[0.86, 0.48, 0.02]} castShadow receiveShadow>
        <meshStandardMaterial color="#F2E4D5" roughness={0.88} flatShading />
      </mesh>

      {/* Coral Accent Throw Pillow */}
      <mesh
        geometry={throwPillowGeo}
        position={[-0.56, 0.56, -0.14]}
        rotation={[0.25, 0.35, -0.15]}
        castShadow
      >
        <meshStandardMaterial color="#FF5A1F" roughness={0.85} flatShading />
      </mesh>
    </group>
  );
}

export function PebblePouf() {
  return (
    <group>
      <mesh geometry={poufRingGeo} position={[0, 0.04, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#8B5A2B" roughness={0.82} flatShading />
      </mesh>
      <mesh geometry={poufBodyGeo} position={[0, 0.32, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#E07A5F" roughness={0.86} flatShading />
      </mesh>
    </group>
  );
}

export function SculptedBonsai() {
  return (
    <group>
      {/* Hexagonal Ceramic Tray */}
      <mesh geometry={bonsaiTrayGeo} position={[0, 0.07, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#2B3A4A" roughness={0.75} flatShading />
      </mesh>
      <mesh geometry={bonsaiSoilGeo} position={[0, 0.14, 0]} receiveShadow>
        <meshStandardMaterial color="#5C4028" roughness={0.95} flatShading />
      </mesh>

      {/* Angled Sculpted Trunk */}
      <mesh
        geometry={bonsaiTrunkLowGeo}
        position={[-0.03, 0.28, 0]}
        rotation={[0, 0, -0.24]}
        castShadow
      >
        <meshStandardMaterial color="#6F4527" roughness={0.88} flatShading />
      </mesh>
      <mesh
        geometry={bonsaiTrunkMidGeo}
        position={[0.04, 0.52, 0.02]}
        rotation={[0.1, 0, 0.28]}
        castShadow
      >
        <meshStandardMaterial color="#6F4527" roughness={0.88} flatShading />
      </mesh>

      {/* 3 Tiered Faceted Canopy Pads */}
      <mesh geometry={bonsaiPadLargeGeo} position={[-0.18, 0.54, 0.06]} castShadow receiveShadow>
        <meshStandardMaterial color="#387D54" roughness={0.8} flatShading />
      </mesh>
      <mesh geometry={bonsaiPadSmallGeo} position={[0.2, 0.62, -0.05]} castShadow receiveShadow>
        <meshStandardMaterial color="#4A9B68" roughness={0.8} flatShading />
      </mesh>
      <mesh geometry={bonsaiPadLargeGeo} position={[0.02, 0.76, 0.02]} castShadow receiveShadow>
        <meshStandardMaterial color="#52B788" roughness={0.78} flatShading />
      </mesh>
    </group>
  );
}

export function CrystalPrismLamp() {
  return (
    <group>
      <mesh geometry={crystalBaseGeo} position={[0, 0.07, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#17233F" roughness={0.75} flatShading />
      </mesh>
      <mesh geometry={crystalCollarGeo} position={[0, 0.17, 0]} castShadow>
        <meshStandardMaterial color="#D4A373" roughness={0.6} flatShading />
      </mesh>

      {/* Main Glowing Crystal Spire */}
      <mesh geometry={crystalShardMainGeo} position={[0, 0.52, 0]} castShadow>
        <meshStandardMaterial
          color="#FFF7E6"
          emissive="#FFAE42"
          emissiveIntensity={2.1}
          toneMapped={false}
          flatShading
        />
      </mesh>

      {/* Two Angled Side Crystals */}
      <mesh
        geometry={crystalShardSideGeo}
        position={[-0.12, 0.38, 0.06]}
        rotation={[0.18, 0.2, 0.34]}
      >
        <meshStandardMaterial
          color="#FFF7E6"
          emissive="#FF8C42"
          emissiveIntensity={1.8}
          toneMapped={false}
          flatShading
        />
      </mesh>
      <mesh
        geometry={crystalShardSideGeo}
        position={[0.11, 0.36, -0.05]}
        rotation={[-0.16, -0.2, -0.32]}
      >
        <meshStandardMaterial
          color="#FFF7E6"
          emissive="#FFD166"
          emissiveIntensity={1.8}
          toneMapped={false}
          flatShading
        />
      </mesh>

      <pointLight position={[0, 0.65, 0]} intensity={1.8} distance={4.5} decay={2} color="#FFBE6B" />
    </group>
  );
}

export function FacetedShroomLamp() {
  return (
    <group>
      <mesh geometry={shroomBaseGeo} position={[0, 0.19, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#F5EBE0" roughness={0.78} flatShading />
      </mesh>
      <mesh geometry={shroomGlowGeo} position={[0, 0.39, 0]}>
        <meshStandardMaterial
          color="#FFFDF7"
          emissive="#FFD180"
          emissiveIntensity={2.2}
          toneMapped={false}
          flatShading
        />
      </mesh>
      <mesh geometry={shroomCapGeo} position={[0, 0.55, 0]} castShadow>
        <meshStandardMaterial color="#FF5A1F" roughness={0.68} flatShading />
      </mesh>
      <pointLight position={[0, 0.42, 0]} intensity={1.6} distance={4.2} decay={2} color="#FFAD5C" />
    </group>
  );
}

export function PebbleTeaTable() {
  return (
    <group>
      {/* 3 Splayed Mid-Century Legs */}
      <mesh
        geometry={tableLegGeo}
        position={[-0.44, 0.21, 0.18]}
        rotation={[0.14, 0, 0.16]}
        castShadow
      >
        <meshStandardMaterial color="#8B5A2B" roughness={0.8} flatShading />
      </mesh>
      <mesh
        geometry={tableLegGeo}
        position={[0.46, 0.21, 0.16]}
        rotation={[0.14, 0, -0.16]}
        castShadow
      >
        <meshStandardMaterial color="#8B5A2B" roughness={0.8} flatShading />
      </mesh>
      <mesh
        geometry={tableLegGeo}
        position={[0.02, 0.21, -0.24]}
        rotation={[-0.18, 0, 0]}
        castShadow
      >
        <meshStandardMaterial color="#8B5A2B" roughness={0.8} flatShading />
      </mesh>

      {/* Organic Pebble Tabletop */}
      <mesh geometry={pebbleTopGeo} position={[0, 0.45, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#D4A373" roughness={0.75} flatShading />
      </mesh>

      {/* Miniature Ceramic Teapot Accent */}
      <mesh geometry={teapotBodyGeo} position={[0.18, 0.54, -0.04]} castShadow>
        <meshStandardMaterial color="#2D6A4F" roughness={0.65} flatShading />
      </mesh>
      <mesh geometry={teapotLidGeo} position={[0.18, 0.66, -0.04]} castShadow>
        <meshStandardMaterial color="#FFE600" roughness={0.6} flatShading />
      </mesh>
    </group>
  );
}

export function CompactDJDeck() {
  return (
    <group>
      {/* Angled Console Cabinet */}
      <mesh geometry={djStandGeo} position={[0, 0.38, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#17233F" roughness={0.75} flatShading />
      </mesh>

      {/* Deck Surface */}
      <mesh geometry={djDeckTopGeo} position={[0, 0.77, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#263554" roughness={0.65} flatShading />
      </mesh>

      {/* Dual 8-Sided Turntable Platters */}
      <mesh geometry={platterGeo} position={[-0.38, 0.815, 0]} castShadow>
        <meshStandardMaterial color="#080808" roughness={0.5} flatShading />
      </mesh>
      <mesh geometry={platterGeo} position={[0.38, 0.815, 0]} castShadow>
        <meshStandardMaterial color="#080808" roughness={0.5} flatShading />
      </mesh>

      {/* Glowing Center Mixer Equalizer Bars */}
      {[-0.08, 0, 0.08].map((bx, i) => (
        <mesh key={i} geometry={eqBarGeo} position={[bx, 0.81, 0]}>
          <meshStandardMaterial
            color="#FFFFFF"
            emissive={i === 1 ? "#38BDF8" : "#FF5A1F"}
            emissiveIntensity={2.2}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// --- Master Low-Poly Dispatcher ---

export function LowPolyMesh({ itemId }) {
  switch (itemId) {
    case "plant-monstera":
      return <FacetedMonstera />;
    case "sofa-cloud-lp":
      return <CloudLounger />;
    case "pouf-pebble-lp":
      return <PebblePouf />;
    case "plant-bonsai-lp":
      return <SculptedBonsai />;
    case "lamp-crystal-lp":
      return <CrystalPrismLamp />;
    case "lamp-shroom-lp":
      return <FacetedShroomLamp />;
    case "table-pebble-lp":
      return <PebbleTeaTable />;
    case "table-dj-lp":
      return <CompactDJDeck />;
    default:
      return null;
  }
}