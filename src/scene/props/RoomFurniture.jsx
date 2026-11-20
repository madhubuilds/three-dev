import * as THREE from "three";
import { useAvatarStore } from "../../store/useAvatarStore";
import { LowPolyMesh } from "./LowPolyAssets";
import { getEffectiveExtents, FURNITURE_SCALE } from "../../data/roomCatalog";
import { useCollider } from "../hooks/useCollider";
// Shared Geometries
const sofaBaseGeo = new THREE.BoxGeometry(2.2, 0.36, 1.0);
const sofaBackGeo = new THREE.BoxGeometry(2.2, 0.55, 0.24);
const sofaArmGeo = new THREE.BoxGeometry(0.24, 0.52, 1.0);
const sofaLegGeo = new THREE.BoxGeometry(0.14, 0.16, 0.14);
const poufGeo = new THREE.CylinderGeometry(0.52, 0.52, 0.44, 24);

const potGeo = new THREE.CylinderGeometry(0.32, 0.24, 0.46, 16);
const monsteraLowGeo = new THREE.BoxGeometry(0.8, 0.5, 0.8);
const monsteraTopGeo = new THREE.BoxGeometry(0.52, 0.48, 0.52);
const cactusTrunkGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.85, 12);
const cactusArmGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.36, 10);
const bonsaiTrayGeo = new THREE.BoxGeometry(0.75, 0.16, 0.55);
const bonsaiTrunkGeo = new THREE.CylinderGeometry(0.06, 0.09, 0.45, 8);
const bonsaiLeafGeo = new THREE.BoxGeometry(0.68, 0.28, 0.52);

const sideTableGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.52, 20);
const mushStemGeo = new THREE.CylinderGeometry(0.09, 0.13, 0.28, 16);
const mushCapGeo = new THREE.SphereGeometry(
  0.28,
  20,
  14,
  0,
  Math.PI * 2,
  0,
  Math.PI / 2,
);

const floorBaseGeo = new THREE.CylinderGeometry(0.28, 0.32, 0.08, 20);
const floorPoleGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.85, 10);
const floorShadeGeo = new THREE.CylinderGeometry(0.18, 0.34, 0.38, 20);

const neonFrameGeo = new THREE.BoxGeometry(0.76, 0.76, 0.76);
const neonCoreGeo = new THREE.BoxGeometry(0.62, 0.62, 0.62);

const coffeeTopGeo = new THREE.BoxGeometry(1.6, 0.12, 0.9);
const coffeeLegGeo = new THREE.BoxGeometry(0.12, 0.38, 0.12);
const arcadeBodyGeo = new THREE.BoxGeometry(0.85, 1.65, 0.85);
const arcadeScreenGeo = new THREE.BoxGeometry(0.64, 0.48, 0.06);

const selectRingGeo = new THREE.RingGeometry(0.85, 1.02, 32);


export function FurnitureMesh({ itemId }) {
  const lowPoly = LowPolyMesh({ itemId });
  if (lowPoly) return lowPoly;
  switch (itemId) {
    case "sofa-cozy":
    case "sofa-navy": {
      const fabric = itemId === "sofa-navy" ? "#17233F" : "#FF5A1F";
      return (
        <group>
          <mesh
            geometry={sofaBaseGeo}
            position={[0, 0.32, 0]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color={fabric} roughness={0.85} />
          </mesh>
          <mesh
            geometry={sofaBackGeo}
            position={[0, 0.72, -0.38]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color={fabric} roughness={0.85} />
          </mesh>
          <mesh geometry={sofaArmGeo} position={[-0.98, 0.52, 0]} castShadow>
            <meshStandardMaterial color={fabric} roughness={0.85} />
          </mesh>
          <mesh geometry={sofaArmGeo} position={[0.98, 0.52, 0]} castShadow>
            <meshStandardMaterial color={fabric} roughness={0.85} />
          </mesh>
          {[
            [-0.9, -0.35],
            [0.9, -0.35],
            [-0.9, 0.35],
            [0.9, 0.35],
          ].map(([lx, lz], i) => (
            <mesh
              key={i}
              geometry={sofaLegGeo}
              position={[lx, 0.08, lz]}
              castShadow
            >
              <meshStandardMaterial color="#080808" roughness={0.7} />
            </mesh>
          ))}
        </group>
      );
    }

    case "pouf-yellow":
      return (
        <mesh
          geometry={poufGeo}
          position={[0, 0.22, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#FFE600" roughness={0.85} />
        </mesh>
      );

    case "plant-monstera":
      return (
        <group>
          <mesh
            geometry={potGeo}
            position={[0, 0.23, 0]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color="#9E5326" roughness={0.85} />
          </mesh>
          <mesh geometry={monsteraLowGeo} position={[0, 0.68, 0]} castShadow>
            <meshStandardMaterial color="#16A34A" roughness={0.85} />
          </mesh>
          <mesh
            geometry={monsteraTopGeo}
            position={[0, 1.08, 0]}
            rotation={[0, 0.6, 0]}
            castShadow
          >
            <meshStandardMaterial color="#22C55E" roughness={0.85} />
          </mesh>
        </group>
      );

    case "plant-cactus":
      return (
        <group>
          <mesh
            geometry={potGeo}
            position={[0, 0.23, 0]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color="#E2B48A" roughness={0.85} />
          </mesh>
          <mesh geometry={cactusTrunkGeo} position={[0, 0.85, 0]} castShadow>
            <meshStandardMaterial color="#15803D" roughness={0.85} />
          </mesh>
          <mesh
            geometry={cactusArmGeo}
            position={[-0.22, 0.82, 0]}
            rotation={[0, 0, 0.6]}
            castShadow
          >
            <meshStandardMaterial color="#16A34A" roughness={0.85} />
          </mesh>
          <mesh
            geometry={cactusArmGeo}
            position={[0.22, 0.96, 0]}
            rotation={[0, 0, -0.6]}
            castShadow
          >
            <meshStandardMaterial color="#16A34A" roughness={0.85} />
          </mesh>
        </group>
      );

    case "plant-bonsai":
      return (
        <group>
          <mesh
            geometry={bonsaiTrayGeo}
            position={[0, 0.08, 0]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color="#17233F" roughness={0.8} />
          </mesh>
          <mesh
            geometry={bonsaiTrunkGeo}
            position={[0, 0.36, 0]}
            rotation={[0, 0, 0.2]}
            castShadow
          >
            <meshStandardMaterial color="#7C4722" roughness={0.9} />
          </mesh>
          <mesh geometry={bonsaiLeafGeo} position={[0.08, 0.62, 0]} castShadow>
            <meshStandardMaterial color="#22C55E" roughness={0.85} />
          </mesh>
        </group>
      );

    case "lamp-mushroom":
      return (
        <group>
          <mesh
            geometry={sideTableGeo}
            position={[0, 0.26, 0]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color="#9E5326" roughness={0.8} />
          </mesh>
          <mesh geometry={mushStemGeo} position={[0, 0.66, 0]} castShadow>
            <meshStandardMaterial color="#FFF6E8" roughness={0.7} />
          </mesh>
          <mesh geometry={mushCapGeo} position={[0, 0.78, 0]}>
            <meshStandardMaterial
              color="#FFFDF7"
              emissive="#FFBE6B"
              emissiveIntensity={2.3}
              toneMapped={false}
            />
          </mesh>
          <pointLight
            position={[0, 1.15, 0]}
            intensity={2.4}
            distance={5}
            decay={2}
            color="#FFB35C"
          />
        </group>
      );

    case "lamp-floor":
      return (
        <group>
          <mesh
            geometry={floorBaseGeo}
            position={[0, 0.04, 0]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color="#080808" roughness={0.7} />
          </mesh>
          <mesh geometry={floorPoleGeo} position={[0, 0.96, 0]} castShadow>
            <meshStandardMaterial color="#080808" roughness={0.7} />
          </mesh>
          <mesh geometry={floorShadeGeo} position={[0, 1.85, 0]}>
            <meshStandardMaterial
              color="#FFFDF7"
              emissive="#FFD180"
              emissiveIntensity={2.3}
              toneMapped={false}
            />
          </mesh>
          <pointLight
            position={[0, 1.75, 0]}
            intensity={2.8}
            distance={6}
            decay={2}
            color="#FFAD5C"
          />
        </group>
      );

    case "lamp-neon":
      return (
        <group>
          <mesh
            geometry={neonFrameGeo}
            position={[0, 0.38, 0]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color="#080808" roughness={0.6} wireframe />
          </mesh>
          <mesh geometry={neonCoreGeo} position={[0, 0.38, 0]}>
            <meshStandardMaterial
              color="#E0F2FE"
              emissive="#00E5FF"
              emissiveIntensity={2.1}
              toneMapped={false}
            />
          </mesh>
          <pointLight
            position={[0, 0.7, 0]}
            intensity={2.2}
            distance={5}
            decay={2}
            color="#38BDF8"
          />
        </group>
      );

    case "table-coffee":
      return (
        <group>
          <mesh
            geometry={coffeeTopGeo}
            position={[0, 0.42, 0]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color="#9E5326" roughness={0.8} />
          </mesh>
          {[
            [-0.68, -0.34],
            [0.68, -0.34],
            [-0.68, 0.34],
            [0.68, 0.34],
          ].map(([lx, lz], i) => (
            <mesh
              key={i}
              geometry={coffeeLegGeo}
              position={[lx, 0.19, lz]}
              castShadow
            >
              <meshStandardMaterial color="#080808" roughness={0.7} />
            </mesh>
          ))}
        </group>
      );

    case "table-arcade":
      return (
        <group>
          <mesh
            geometry={arcadeBodyGeo}
            position={[0, 0.825, 0]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color="#17233F" roughness={0.8} />
          </mesh>
          <mesh
            geometry={arcadeScreenGeo}
            position={[0, 1.18, 0.41]}
            rotation={[-0.25, 0, 0]}
          >
            <meshStandardMaterial
              color="#FFFDF7"
              emissive="#FF5A1F"
              emissiveIntensity={2.0}
              toneMapped={false}
            />
          </mesh>
        </group>
      );

    default:
      return null;
  }
}

function PlacedItemNode({ item }) {
  const isDecorating = useAvatarStore((s) => s.isDecorating);
  const selectedInstanceId = useAvatarStore((s) => s.selectedInstanceId);
  const selectRoomItem = useAvatarStore((s) => s.selectRoomItem);

  const isSelected = isDecorating && selectedInstanceId === item.instanceId;
  const { halfW, halfD } = getEffectiveExtents(item.itemId, item.rotation);
  useCollider(item.instanceId, item.x, item.z, halfW, halfD);

  // Automatically registers & updates solid AABB collision when moved or rotated
  useCollider(item.instanceId, item.x, item.z, halfW, halfD);

  return (
    <group
      position={[item.x, 0, item.z]}
      rotation={[0, (item.rotation * Math.PI) / 2, 0]}
      scale={FURNITURE_SCALE}
      onClick={(e) => {
        if (!isDecorating) return;
        e.stopPropagation();
        selectRoomItem(item.instanceId);
      }}
    >
      <FurnitureMesh itemId={item.itemId} />

      {isSelected && (
        <mesh
          geometry={selectRingGeo}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.035, 0]}
        >
          <meshBasicMaterial color="#FFE600" />
        </mesh>
      )}
    </group>
  );
}

export function PlacedFurnitureLayer() {
  const placedItems = useAvatarStore((s) => s.placedItems);
  return (
    <>
      {placedItems.map((item) => (
        <PlacedItemNode key={item.instanceId} item={item} />
      ))}
    </>
  );
}
