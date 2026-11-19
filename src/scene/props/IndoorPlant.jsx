import * as THREE from "three";
import { useCollider } from "../hooks/useCollider";

const potGeo = new THREE.CylinderGeometry(0.32, 0.24, 0.5, 16);
const leafLowerGeo = new THREE.BoxGeometry(0.75, 0.55, 0.75);
const leafUpperGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);

export function IndoorPlant({ id = "plant-1", position = [-5.8, 0, -5.8] }) {
  useCollider(id, position[0], position[2], 0.4, 0.4);

  return (
    <group position={position}>
      <mesh geometry={potGeo} position={[0, 0.25, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#FF5A1F" />
      </mesh>
      <mesh geometry={leafLowerGeo} position={[0, 0.72, 0]} castShadow>
        <meshStandardMaterial color="#16A34A" />
      </mesh>
      <mesh geometry={leafUpperGeo} position={[0, 1.15, 0]} rotation={[0, 0.6, 0]} castShadow>
        <meshStandardMaterial color="#22C55E" />
      </mesh>
    </group>
  );
}