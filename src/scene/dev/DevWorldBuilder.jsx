import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { TransformControls } from "@react-three/drei";
import * as THREE from "three";
import {
  createStyledGeometry,
  getGradientAtlasTexture,
} from "../../utils/gradientPalette";
import { useDevBuilderStore } from "../../store/useDevBuilderStore";

const WORLD_X_AXIS = new THREE.Vector3(1, 0, 0);

function DevBlockMesh({
  block,
  spanRange,
  activeTool,
  isSelected,
  isInSelectedFolder,
  onSelect,
  onStackBlock,
  meshRefCallback,
}) {
  const posY = block.position[1];
  const scaleY = block.scale[1];
  const gradientMode = block.gradientMode || "continuous";

  const geometry = useMemo(
    () =>
      createStyledGeometry(block.shape, block.style, block.gradientIndex ?? 0, {
        gradientMode,
        posY,
        scaleY,
        spanMinY: spanRange.minY,
        spanMaxY: spanRange.maxY,
      }),
    [
      block.shape,
      block.style,
      block.gradientIndex,
      gradientMode,
      posY,
      scaleY,
      spanRange.minY,
      spanRange.maxY,
    ]
  );

  useEffect(() => () => geometry.dispose(), [geometry]);

  const atlasTexture = useMemo(() => getGradientAtlasTexture(), []);
  const isLowPoly = block.style === "lowpoly";

  return (
    <mesh
      ref={meshRefCallback}
      name={block.name || "dev-builder-block"}
      geometry={geometry}
      position={block.position}
      rotation={block.rotation}
      scale={block.scale}
      castShadow
      receiveShadow
      onPointerDown={(e) => {
        e.stopPropagation();
      }}
      onClick={(e) => {
        if (e.delta > 5) return;
        e.stopPropagation();

        if (activeTool === "place") {
          const topSurfaceY = block.position[1] + block.scale[1] / 2;
          onStackBlock(e.point.x, topSurfaceY, e.point.z);
        } else {
          onSelect(block.id);
        }
      }}
    >
      <meshStandardMaterial
        key={`${block.customColor ? "hex" : "atlas"}-${isLowPoly}`}
        map={block.customColor ? null : atlasTexture}
        color={block.customColor || "#FFFFFF"}
        roughness={0.76}
        flatShading={isLowPoly}
      />
      {(isSelected || isInSelectedFolder) && (
        <lineSegments>
          <edgesGeometry args={[geometry]} />
          <lineBasicMaterial color={isSelected ? "#FFE600" : "#FF5A1F"} />
        </lineSegments>
      )}
    </mesh>
  );
}

export function DevWorldBuilder({ size = 24 }) {
  const ghostRef = useRef();
  const animGroupRef = useRef();
  const meshMap = useRef(new Map());
  const [selectedMeshObj, setSelectedMeshObj] = useState(null);

  const theme = useDevBuilderStore((s) => s.theme);
  const activeTool = useDevBuilderStore((s) => s.activeTool);
  const selectedShape = useDevBuilderStore((s) => s.selectedShape);
  const selectedStyle = useDevBuilderStore((s) => s.selectedStyle);
  const selectedGradient = useDevBuilderStore((s) => s.selectedGradient);
  const gradientMode = useDevBuilderStore((s) => s.gradientMode);
  const customColor = useDevBuilderStore((s) => s.customColor);
  const gridSnap = useDevBuilderStore((s) => s.gridSnap);
  const transformMode = useDevBuilderStore((s) => s.transformMode);
  const previewAnim = useDevBuilderStore((s) => s.previewAnim);
  const previewSteer = useDevBuilderStore((s) => s.previewSteer);
  const folders = useDevBuilderStore((s) => s.folders);
  const selectedFolderId = useDevBuilderStore((s) => s.selectedFolderId);
  const blocks = useDevBuilderStore((s) => s.blocks);
  const selectedBlockId = useDevBuilderStore((s) => s.selectedBlockId);

  const selectBlock = useDevBuilderStore((s) => s.selectBlock);
  const addBlock = useDevBuilderStore((s) => s.addBlock);
  const updateBlockTransform = useDevBuilderStore((s) => s.updateBlockTransform);
  const setIsDraggingGizmo = useDevBuilderStore((s) => s.setIsDraggingGizmo);

  const isDark = theme === "dark";

  const hiddenFolderIds = useMemo(
    () =>
      new Set(folders.filter((f) => f.visible === false).map((f) => f.id)),
    [folders]
  );

  const visibleBlocks = useMemo(
    () =>
      blocks.filter((b) => !b.folderId || !hiddenFolderIds.has(b.folderId)),
    [blocks, hiddenFolderIds]
  );

  // Determine which blocks receive the live animation preview:
  // 1. Selected folder, 2. Parent folder of selected block, 3. Single selected block, or 4. All visible blocks
  const animatedBlockIds = useMemo(() => {
    if (previewAnim === "none") return new Set();

    if (selectedFolderId) {
      return new Set(
        visibleBlocks
          .filter((b) => b.folderId === selectedFolderId)
          .map((b) => b.id)
      );
    }

    if (selectedBlockId) {
      const sel = visibleBlocks.find((b) => b.id === selectedBlockId);
      if (sel?.folderId) {
        return new Set(
          visibleBlocks
            .filter((b) => b.folderId === sel.folderId)
            .map((b) => b.id)
        );
      }
      return new Set([selectedBlockId]);
    }

    return new Set(visibleBlocks.map((b) => b.id));
  }, [previewAnim, selectedFolderId, selectedBlockId, visibleBlocks]);

  const animatedBlocks = useMemo(
    () => visibleBlocks.filter((b) => animatedBlockIds.has(b.id)),
    [visibleBlocks, animatedBlockIds]
  );

  const staticBlocks = useMemo(
    () => visibleBlocks.filter((b) => !animatedBlockIds.has(b.id)),
    [visibleBlocks, animatedBlockIds]
  );

  // Reset group transform & wheel rotations when preview stops
  useEffect(() => {
    if (previewAnim !== "none") return;
    if (animGroupRef.current) {
      animGroupRef.current.position.set(0, 0, 0);
      animGroupRef.current.rotation.set(0, 0, 0);
      animGroupRef.current.scale.set(1, 1, 1);
    }
    for (const b of blocks) {
      const mesh = meshMap.current.get(b.id);
      if (mesh) {
        mesh.rotation.set(...b.rotation);
      }
    }
  }, [previewAnim, blocks]);

  // 60fps Live Animation Preview Loop
  useFrame(({ clock }, delta) => {
    if (previewAnim === "none" || !animGroupRef.current) return;

    const t = clock.getElapsedTime();
    const lerp = THREE.MathUtils.lerp;

    let targetY = 0;
    let targetPitchX = 0;
    let targetYawY = 0;
    let targetRollZ = 0;
    let targetScaleY = 1;
    let wheelSpin = 0;

    if (previewAnim === "idle") {
      targetY = Math.abs(Math.sin(t * 28)) * 0.012;
    } else if (previewAnim === "drive") {
      wheelSpin = delta * 12;
      targetY = Math.abs(Math.sin(t * 14)) * 0.025;
      targetPitchX = -0.025;
      targetRollZ = -previewSteer * 0.07;
      targetYawY = previewSteer * 0.06;
    } else if (previewAnim === "jump") {
      const phase = (t * 1.15) % 1;
      const arc = Math.sin(phase * Math.PI);
      targetY = arc * 1.25;
      targetPitchX = Math.cos(phase * Math.PI) * -0.18;
      targetScaleY = phase < 0.12 ? 0.92 : 1;
      wheelSpin = delta * 9;
    } else if (previewAnim === "stop") {
      // Rhythmic brake-pulse so you can inspect nose-dive & rebound live
      const brakePulse = Math.max(0, Math.sin(t * 3.2));
      targetPitchX = brakePulse * 0.11;
      targetY = -brakePulse * 0.02;
    } else if (previewAnim === "drift") {
      const driftDir = previewSteer !== 0 ? previewSteer : 1;
      wheelSpin = delta * 16;
      targetYawY = driftDir * 0.34 + Math.sin(t * 6) * 0.04;
      targetRollZ = -driftDir * 0.12;
      targetY = Math.abs(Math.sin(t * 18)) * 0.03;
    }

    // Spin any mesh with "wheel" or "tyre" in its name around its center X axle
    if (wheelSpin !== 0) {
      for (const b of animatedBlocks) {
        const lower = (b.name || "").toLowerCase();
        if (lower.includes("wheel") || lower.includes("tyre") || lower.includes("tire")) {
          const mesh = meshMap.current.get(b.id);
          if (mesh) {
            mesh.rotateOnWorldAxis(WORLD_X_AXIS, wheelSpin);
          }
        }
      }
    }

    animGroupRef.current.position.y = lerp(
      animGroupRef.current.position.y,
      targetY,
      0.18
    );
    animGroupRef.current.rotation.x = lerp(
      animGroupRef.current.rotation.x,
      targetPitchX,
      0.16
    );
    animGroupRef.current.rotation.y = lerp(
      animGroupRef.current.rotation.y,
      targetYawY,
      0.16
    );
    animGroupRef.current.rotation.z = lerp(
      animGroupRef.current.rotation.z,
      targetRollZ,
      0.16
    );
    animGroupRef.current.scale.y = lerp(
      animGroupRef.current.scale.y,
      targetScaleY,
      0.22
    );
  });

  const gradientSpans = useMemo(() => {
    const map = new Map();
    for (const b of visibleBlocks) {
      if (b.customColor) continue;
      const idx = b.gradientIndex ?? 0;
      const bottomY = b.position[1] - b.scale[1] / 2;
      const topY = b.position[1] + b.scale[1] / 2;
      const curr = map.get(idx);
      if (!curr) {
        map.set(idx, { minY: bottomY, maxY: topY });
      } else {
        curr.minY = Math.min(curr.minY, bottomY);
        curr.maxY = Math.max(curr.maxY, topY);
      }
    }
    return map;
  }, [visibleBlocks]);

  const ghostGeo = useMemo(
    () =>
      createStyledGeometry(selectedShape, selectedStyle, selectedGradient, {
        gradientMode: gradientMode === "uniform" ? "uniform" : "object",
      }),
    [selectedShape, selectedStyle, selectedGradient, gradientMode]
  );

  useEffect(() => () => ghostGeo.dispose(), [ghostGeo]);

  useEffect(() => {
    if (!selectedBlockId) {
      setSelectedMeshObj(null);
      return;
    }
    const obj = meshMap.current.get(selectedBlockId) || null;
    setSelectedMeshObj(obj);
  }, [selectedBlockId, visibleBlocks]);

  const atlasTexture = useMemo(() => getGradientAtlasTexture(), []);

  const snap = (val) => Math.round(val / gridSnap) * gridSnap;

  const handleSurfaceMove = (e) => {
    if (activeTool !== "place" || !ghostRef.current) return;
    e.stopPropagation();
    ghostRef.current.visible = true;
    ghostRef.current.position.set(snap(e.point.x), 0.5, snap(e.point.z));
  };

  const handleSurfaceClick = (e) => {
    if (e.delta > 5) return;
    e.stopPropagation();

    if (activeTool === "place") {
      addBlock([snap(e.point.x), 0, snap(e.point.z)], false);
    } else {
      selectBlock(null);
    }
  };

  const handleStackBlock = (rawX, topSurfaceY, rawZ) => {
    addBlock([snap(rawX), topSurfaceY, snap(rawZ)], false);
  };

  const renderBlock = (block) => {
    const spanRange = gradientSpans.get(block.gradientIndex ?? 0) || {
      minY: 0,
      maxY: 1,
    };
    return (
      <DevBlockMesh
        key={block.id}
        block={block}
        spanRange={spanRange}
        activeTool={activeTool}
        isSelected={block.id === selectedBlockId}
        isInSelectedFolder={
          Boolean(selectedFolderId) && block.folderId === selectedFolderId
        }
        onSelect={selectBlock}
        onStackBlock={handleStackBlock}
        meshRefCallback={(node) => {
          if (node) meshMap.current.set(block.id, node);
          else meshMap.current.delete(block.id);
        }}
      />
    );
  };

  return (
    <group>
      {/* Snapping Grid Overlay */}
      <gridHelper
        key={theme}
        args={[size, size * 2, "#FF5A1F", isDark ? "#64748B" : "#17233F"]}
        position={[0, 0.025, 0]}
        material-opacity={isDark ? 0.28 : 0.32}
        material-transparent
      />

      {/* Raycast Placement Plane */}
      <mesh
        position={[0, 0.015, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerMove={handleSurfaceMove}
        onClick={handleSurfaceClick}
      >
        <planeGeometry args={[size, size]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Translucent Grid-Snapped Ghost Preview */}
      {activeTool === "place" && (
        <mesh ref={ghostRef} geometry={ghostGeo} position={[0, 0.5, 0]}>
          <meshStandardMaterial
            map={customColor ? null : atlasTexture}
            color={customColor || "#FFFFFF"}
            transparent
            opacity={0.55}
            flatShading={selectedStyle === "lowpoly"}
          />
        </mesh>
      )}

      {/* Static Blocks */}
      {staticBlocks.map(renderBlock)}

      {/* Live Animated Blocks / Folder Group */}
      <group ref={animGroupRef}>{animatedBlocks.map(renderBlock)}</group>

      {/* 3D Transform Gizmo (Hidden while live animation preview is running) */}
      {previewAnim === "none" && selectedBlockId && selectedMeshObj && (
        <TransformControls
          key={selectedBlockId}
          object={selectedMeshObj}
          mode={transformMode}
          size={0.8}
          translationSnap={gridSnap}
          rotationSnap={Math.PI / 12}
          scaleSnap={0.25}
          onMouseDown={() => setIsDraggingGizmo(true)}
          onMouseUp={() => {
            setIsDraggingGizmo(false);
            if (!selectedMeshObj) return;
            updateBlockTransform(
              selectedBlockId,
              selectedMeshObj.position.toArray(),
              [
                selectedMeshObj.rotation.x,
                selectedMeshObj.rotation.y,
                selectedMeshObj.rotation.z,
              ],
              selectedMeshObj.scale.toArray()
            );
          }}
        />
      )}
    </group>
  );
}