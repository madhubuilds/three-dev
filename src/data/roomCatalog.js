export const ROOM_CATEGORIES = [
  { id: "sofa", label: "Sofas" },
  { id: "plants", label: "Plants" },
  { id: "lamps", label: "Lamps" },
  { id: "tables", label: "Tables" },
];

export const ROOM_ITEMS = [
  // SOFAS
  {
    id: "sofa-cozy",
    category: "sofa",
    label: "Cozy Sofa",
    halfW: 1.15,
    halfD: 0.55,
  },
  {
    id: "sofa-navy",
    category: "sofa",
    label: "Navy Lounge",
    halfW: 1.15,
    halfD: 0.55,
  },
  {
    id: "pouf-yellow",
    category: "sofa",
    label: "Yellow Pouf",
    halfW: 0.55,
    halfD: 0.55,
  },

  // PLANTS
  {
    id: "plant-monstera",
    category: "plants",
    label: "Monstera",
    halfW: 0.45,
    halfD: 0.45,
  },
  {
    id: "plant-cactus",
    category: "plants",
    label: "Cactus",
    halfW: 0.4,
    halfD: 0.4,
  },
  {
    id: "plant-bonsai",
    category: "plants",
    label: "Zen Bonsai",
    halfW: 0.45,
    halfD: 0.45,
  },

  // EMISSIVE LAMPS
  {
    id: "lamp-mushroom",
    category: "lamps",
    label: "Mushroom Lamp",
    halfW: 0.42,
    halfD: 0.42,
  },
  {
    id: "lamp-floor",
    category: "lamps",
    label: "Studio Lamp",
    halfW: 0.42,
    halfD: 0.42,
  },
  {
    id: "lamp-neon",
    category: "lamps",
    label: "Neon Cube",
    halfW: 0.45,
    halfD: 0.45,
  },

  // TABLES & DECOR
  {
    id: "table-coffee",
    category: "tables",
    label: "Coffee Table",
    halfW: 0.85,
    halfD: 0.5,
  },
  {
    id: "table-arcade",
    category: "tables",
    label: "Mini Arcade",
    halfW: 0.5,
    halfD: 0.5,
  },
];

export const FURNITURE_SCALE = 1.55;
export function getCatalogItem(itemId) {
  return ROOM_ITEMS.find((item) => item.id === itemId);
}
// Swaps halfW & halfD when rotated 90° or 270°, scaled to match avatar height
export function getEffectiveExtents(itemId, rotation = 0) {
  const item = getCatalogItem(itemId);
  if (!item) {
    return { halfW: 0.5 * FURNITURE_SCALE, halfD: 0.5 * FURNITURE_SCALE };
  }
  const isRotated = rotation % 2 === 1;
  return {
    halfW: (isRotated ? item.halfD : item.halfW) * FURNITURE_SCALE,
    halfD: (isRotated ? item.halfW : item.halfD) * FURNITURE_SCALE,
  };
}
