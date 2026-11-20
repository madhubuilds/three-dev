import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ROOM_ITEMS } from "../../data/roomCatalog";
import { FurnitureMesh } from "../../scene/props/RoomFurniture";

// Module-level cache persists across drawer open/close cycles
const thumbnailCache = new Map();
const listeners = new Set();

function notifyListeners() {
  listeners.forEach((fn) => fn());
}

export function useFurnitureThumbnails() {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const listener = () => forceUpdate((n) => n + 1);
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, []);

  const isComplete = thumbnailCache.size >= ROOM_ITEMS.length;

  return {
    thumbnails: thumbnailCache,
    isCapturing: !isComplete,
  };
}

function SnapshotStage() {
  const { gl, scene, camera } = useThree();
  const groupRef = useRef();
  const frameReady = useRef(false);

  const pendingItems = ROOM_ITEMS.filter((item) => !thumbnailCache.has(item.id));
  const currentItem = pendingItems[0];

  useLayoutEffect(() => {
    if (!currentItem || !groupRef.current) return;

    frameReady.current = false;
    const group = groupRef.current;

    // Reset transform before measuring true 3D bounds
    group.position.set(0, 0, 0);
    group.rotation.set(0, 0, 0);
    group.scale.setScalar(1);
    group.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(group);
    if (!box.isEmpty()) {
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      // Center object at world origin
      group.position.set(-center.x, -center.y, -center.z);

      // Fit largest dimension cleanly inside the 160x160 orthographic frame
      const maxDim = Math.max(size.x, size.y, size.z, 0.5);
      camera.zoom = 108 / maxDim;
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    }

    frameReady.current = true;
  }, [currentItem, camera]);

  useFrame(() => {
    if (!currentItem || !frameReady.current) return;
    frameReady.current = false;

    // Force an explicit synchronous draw so buffer is ready for toDataURL
    gl.render(scene, camera);
    const dataUrl = gl.domElement.toDataURL("image/png");

    thumbnailCache.set(currentItem.id, dataUrl);
    notifyListeners();
  });

  if (!currentItem) return null;

  return (
    <group key={currentItem.id} ref={groupRef}>
      <FurnitureMesh itemId={currentItem.id} />
    </group>
  );
}

export function FurnitureThumbnailGenerator() {
  const { isCapturing } = useFurnitureThumbnails();

  // Unmount Canvas completely once all items are cached (0 active WebGL contexts)
  if (!isCapturing) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed -left-[9999px] -top-[9999px] h-[160px] w-[160px] opacity-0"
    >
      <Canvas
        dpr={1}
        orthographic
        frameloop="always"
        gl={{
          alpha: true,
          antialias: true,
          preserveDrawingBuffer: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.08,
        }}
        camera={{ position: [5, 5, 5], zoom: 55, near: -20, far: 50 }}
      >
        <ambientLight intensity={1.15} color="#FFF8EE" />
        <directionalLight position={[-4, 8, 5]} intensity={1.65} color="#FFE2C2" />
        <directionalLight position={[5, 4, -3]} intensity={0.65} color="#D8E8FF" />
        <SnapshotStage />
      </Canvas>
    </div>
  );
}