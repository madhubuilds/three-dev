import * as THREE from "three";

export const GRADIENT_PALETTE = [
  // --- Extracted from variation-a.png (Row 1) ---
  { id: "peach-cream", name: "Peach Cream", top: "#FDE6C9", bottom: "#F1C797" },
  { id: "orchid-violet", name: "Orchid Violet", top: "#9E6EE3", bottom: "#5E38B8" },
  { id: "cloud-white", name: "Cloud White", top: "#FFFFFF", bottom: "#C9CADB" },
  { id: "tangerine-blaze", name: "Tangerine Blaze", top: "#FF9436", bottom: "#F76432" },
  { id: "cobalt-periwinkle", name: "Cobalt Periwinkle", top: "#5D8FD9", bottom: "#4756B8" },
  { id: "brick-crimson", name: "Brick Crimson", top: "#EA5941", bottom: "#C3423B" },
  { id: "ice-azure", name: "Ice Azure", top: "#D3E9FF", bottom: "#6B9CE3" },
  { id: "amethyst-dusk", name: "Amethyst Dusk", top: "#9E76E5", bottom: "#5A39B8" },

  // --- Extracted from variation-a.png (Row 2 + Top Black) ---
  { id: "charcoal-obsidian", name: "Charcoal Obsidian", top: "#464850", bottom: "#2C2D32" },
  { id: "storm-steel", name: "Storm Steel", top: "#848B9D", bottom: "#61687A" },
  { id: "graphite-iron", name: "Graphite Iron", top: "#535764", bottom: "#3B3E48" },
  { id: "periwinkle-mist", name: "Periwinkle Mist", top: "#BCC6EC", bottom: "#76809E" },
  { id: "silver-pearl", name: "Silver Pearl", top: "#FBFBFD", bottom: "#C4C5D6" },
  { id: "apricot-copper", name: "Apricot Copper", top: "#ED9563", bottom: "#BD6942" },
  { id: "rust-sienna", name: "Rust Sienna", top: "#B65D3B", bottom: "#823B22" },
  { id: "caramel-sand", name: "Caramel Sand", top: "#ECC098", bottom: "#BD8964" },
  { id: "obsidian-black", name: "Obsidian Black", top: "#18181B", bottom: "#050507" },

  // --- Additional Studio Accents ---
  { id: "marigold-glow", name: "Marigold Glow", top: "#FFE600", bottom: "#E08E0B" },
  { id: "sage-leaf", name: "Sage Leaf", top: "#6BCB9B", bottom: "#2D6A4F" },
  { id: "deep-pine", name: "Deep Pine", top: "#3A8668", bottom: "#183D2D" },
  { id: "mint-frost", name: "Mint Frost", top: "#A7F3D0", bottom: "#34D399" },
  { id: "walnut-timber", name: "Walnut Timber", top: "#A86E3B", bottom: "#583516" },
  { id: "sky-lagoon", name: "Sky Lagoon", top: "#63D2FF", bottom: "#2563EB" },
  { id: "berry-pop", name: "Berry Pop", top: "#F472B6", bottom: "#BE185D" },
];

const ATLAS_COLUMNS = 32;
let cachedAtlasTexture = null;

// Singleton 512x256 vertical gradient atlas (1 WebGL draw call for all 24 swatches)
export function getGradientAtlasTexture() {
  if (cachedAtlasTexture) return cachedAtlasTexture;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  const colWidth = canvas.width / ATLAS_COLUMNS;

  GRADIENT_PALETTE.forEach((swatch, idx) => {
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, swatch.top);
    grad.addColorStop(1, swatch.bottom);
    ctx.fillStyle = grad;
    ctx.fillRect(idx * colWidth, 0, colWidth, canvas.height);
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;

  cachedAtlasTexture = tex;
  return tex;
}

// Builds Blocky or Low-Poly geometry centered at (0, 0, 0) for true center rotation
export function createStyledGeometry(
  shape = "box",
  style = "blocky",
  gradientIndex = 0,
  options = {}
) {
  const {
    gradientMode = "continuous", // "continuous" | "uniform" | "object"
    posY = 0.5,
    scaleY = 1,
    spanMinY = 0,
    spanMaxY = 1,
  } = options;

  let geo;
  const isLowPoly = style === "lowpoly";

  switch (shape) {
    case "roof":
      geo = isLowPoly
        ? new THREE.ConeGeometry(0.72, 1, 4)
        : new THREE.CylinderGeometry(0.15, 0.72, 1, 4);
      geo.rotateY(Math.PI / 4);
      break;
    case "pillar":
      geo = new THREE.CylinderGeometry(
        isLowPoly ? 0.36 : 0.45,
        0.45,
        1,
        isLowPoly ? 6 : 16
      );
      break;
    case "dome":
      geo = isLowPoly
        ? new THREE.IcosahedronGeometry(0.5, 1)
        : new THREE.SphereGeometry(0.5, 16, 12);
      break;
    case "box":
    default:
      geo = new THREE.BoxGeometry(1, 1, 1);
      break;
  }

  const nonIndexed = geo.index ? geo.toNonIndexed() : geo;

  // Center pivot at true 3D origin (0, 0, 0)
  nonIndexed.center();
  nonIndexed.computeBoundingBox();

  const { min, max } = nonIndexed.boundingBox;
  const localHeight = Math.max(max.y - min.y, 0.001);
  const worldSpan = Math.max(spanMaxY - spanMinY, 0.001);

  const pos = nonIndexed.attributes.position;
  const uv = nonIndexed.attributes.uv;
  const safeIdx = Math.min(Math.max(gradientIndex, 0), GRADIENT_PALETTE.length - 1);
  const uCenter = (safeIdx + 0.5) / ATLAS_COLUMNS;

  for (let i = 0; i < pos.count; i++) {
    const localY = pos.getY(i);
    let vCoord = 0.5;

    if (gradientMode === "uniform") {
      vCoord = 0.58;
    } else if (gradientMode === "object") {
      vCoord = (localY - min.y) / localHeight;
    } else {
      const worldY = posY + localY * scaleY;
      vCoord = (worldY - spanMinY) / worldSpan;
    }

    uv.setXY(i, uCenter, THREE.MathUtils.clamp(vCoord, 0.04, 0.96));
  }

  uv.needsUpdate = true;
  nonIndexed.computeVertexNormals();
  return nonIndexed;
}