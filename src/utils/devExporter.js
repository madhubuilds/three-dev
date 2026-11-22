import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import {
  createStyledGeometry,
  getGradientAtlasTexture,
} from "./gradientPalette";

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function slugifyFilename(name, fallback = "custom-build") {
  const clean = String(name || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return clean || fallback;
}

function computeGradientSpans(blocks) {
  const map = new Map();
  for (const b of blocks) {
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
}

// Exports any subset of blocks (1 folder, 1 selected block, or entire scene) as .glb
export function exportBlocksToGLB(blocks, filename = "custom-build.glb") {
  return new Promise((resolve, reject) => {
    if (!blocks || blocks.length === 0) {
      reject(new Error("No blocks to export"));
      return;
    }

    const exportGroup = new THREE.Group();
    exportGroup.name = "DevBuilderModel";

    const spans = computeGradientSpans(blocks);
    const atlasTexture = getGradientAtlasTexture();
    const disposables = [];

    blocks.forEach((block, index) => {
      const spanRange = spans.get(block.gradientIndex ?? 0) || {
        minY: 0,
        maxY: 1,
      };

      const geometry = createStyledGeometry(
        block.shape,
        block.style,
        block.gradientIndex ?? 0,
        {
          gradientMode: block.gradientMode || "continuous",
          posY: block.position[1],
          scaleY: block.scale[1],
          spanMinY: spanRange.minY,
          spanMaxY: spanRange.maxY,
        }
      );

      const isLowPoly = block.style === "lowpoly";
      const material = new THREE.MeshStandardMaterial({
        name: block.customColor
          ? `Solid_${block.customColor.replace("#", "")}`
          : `GradientAtlas_${isLowPoly ? "LowPoly" : "Blocky"}`,
        map: block.customColor ? null : atlasTexture,
        color: block.customColor || "#FFFFFF",
        roughness: 0.76,
        flatShading: isLowPoly,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.name = (block.name || `Part_${index + 1}`).replace(/\s+/g, "_");
      mesh.position.set(...block.position);
      mesh.rotation.set(...block.rotation);
      mesh.scale.set(...block.scale);

      exportGroup.add(mesh);
      disposables.push(geometry, material);
    });

    // Normalize pivot to bottom-center (0, 0, 0) for clean Blender / R3F placement
    exportGroup.updateMatrixWorld(true);
    const bounds = new THREE.Box3().setFromObject(exportGroup);
    const center = bounds.getCenter(new THREE.Vector3());
    const minY = bounds.min.y;

    exportGroup.children.forEach((child) => {
      child.position.x -= center.x;
      child.position.y -= minY;
      child.position.z -= center.z;
    });
    exportGroup.updateMatrixWorld(true);

    const exporter = new GLTFExporter();
    exporter.parse(
      exportGroup,
      (result) => {
        disposables.forEach((item) => item.dispose());
        if (result instanceof ArrayBuffer) {
          const blob = new Blob([result], { type: "model/gltf-binary" });
          triggerDownload(blob, filename);
          resolve();
        } else {
          reject(new Error("Expected binary ArrayBuffer output"));
        }
      },
      (error) => {
        disposables.forEach((item) => item.dispose());
        reject(error);
      },
      { binary: true }
    );
  });
}

// Exports JSON blueprint (preserving folders + blocks)
export async function exportBlocksToJSON(
  blocks,
  downloadFile = false,
  folders = [],
  filename = null
) {
  const payload = {
    version: 2,
    exportedAt: new Date().toISOString(),
    folderCount: folders.length,
    blockCount: blocks.length,
    folders: folders.map(({ id, name }) => ({ id, name })),
    blocks: blocks.map(
      ({
        name,
        folderId,
        shape,
        style,
        gradientIndex,
        gradientMode,
        customColor,
        position,
        rotation,
        scale,
      }) => ({
        name,
        folderId: folderId || null,
        shape,
        style,
        gradientIndex,
        gradientMode: gradientMode || "continuous",
        customColor: customColor || null,
        position,
        rotation,
        scale,
      })
    ),
  };

  const jsonString = JSON.stringify(payload, null, 2);

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(jsonString);
  }

  if (downloadFile) {
    const blob = new Blob([jsonString], { type: "application/json" });
    triggerDownload(blob, filename || `blueprint-${Date.now()}.json`);
  }

  return jsonString;
}