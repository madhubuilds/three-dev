import { useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Box,
  Hexagon,
  Lamp,
  Layers,
  LayoutGrid,
  Plus,
  RotateCw,
  Sofa,
  Sprout,
  Trash2,
} from "lucide-react";
import { useAvatarStore } from "../../store/useAvatarStore";
import {
  ROOM_CATEGORIES,
  ROOM_ITEMS,
  getCatalogItem,
} from "../../data/roomCatalog";
import {
  FurnitureThumbnailGenerator,
  useFurnitureThumbnails,
} from "./FurnitureThumbnailGenerator";

const CATEGORY_ICONS = {
  sofa: Sofa,
  plants: Sprout,
  lamps: Lamp,
  tables: LayoutGrid,
};

const STYLE_FILTERS = [
  { id: "all", label: "All Styles", icon: Layers },
  { id: "blocky", label: "Blocky", icon: Box },
  { id: "lowpoly", label: "Low-Poly", icon: Hexagon },
];

export function RoomDecorDrawer() {
  const [styleFilter, setStyleFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("sofa");
  const { thumbnails, isCapturing } = useFurnitureThumbnails();

  const {
    isDecorating,
    placedItems,
    selectedInstanceId,
    selectRoomItem,
    addRoomItem,
    moveSelectedItem,
    rotateSelectedItem,
    removeSelectedItem,
  } = useAvatarStore();

  if (!isDecorating) return null;

  const selectedItem = placedItems.find(
    (i) => i.instanceId === selectedInstanceId,
  );
  const selectedMeta = selectedItem
    ? getCatalogItem(selectedItem.itemId)
    : null;

  const visibleItems = ROOM_ITEMS.filter(
    (item) =>
      item.category === activeTab &&
      (styleFilter === "all" || item.style === styleFilter),
  );

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex flex-col items-center">
      {/* One-shot offscreen snapshotter (unmounts automatically once all 18 items cache) */}
      {isCapturing && <FurnitureThumbnailGenerator />}
      {placedItems.length > 0 && (
        <div className="pointer-events-auto mb-2 flex w-[calc(100%-1.5rem)] max-w-md items-center gap-1.5 overflow-x-auto rounded-full border border-white/70 bg-white/85 px-2.5 py-1.5 shadow-[0_8px_20px_rgba(23,35,63,0.14)] backdrop-blur-md">
          <span className="shrink-0 pl-1 text-[10px] font-bold uppercase tracking-wider text-[#17233F]/50">
            Placed:
          </span>
          {placedItems.map((item) => {
            const meta = getCatalogItem(item.itemId);
            const active = item.instanceId === selectedInstanceId;
            return (
              <button
                key={item.instanceId}
                onClick={() => selectRoomItem(item.instanceId)}
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold transition ${
                  active
                    ? "bg-[#FF5A1F] text-white shadow-sm"
                    : "bg-[#17233F]/6 text-[#17233F]/75 hover:bg-[#17233F]/12"
                }`}
              >
                {meta?.label || item.itemId}
              </button>
            );
          })}
        </div>
      )}
      {/* Floating Move & 90° Rotate Bar */}
      {selectedItem && (
        <div className="pointer-events-auto mb-2.5 w-[calc(100%-1.5rem)] max-w-md rounded-2xl border border-white/70 bg-white/90 p-2.5 shadow-[0_12px_30px_rgba(23,35,63,0.18)] backdrop-blur-md">
          <div className="mb-2 flex items-center justify-between px-1">
            <span className="text-xs font-bold text-[#17233F]">
              {selectedMeta?.label}
            </span>
            <button
              onClick={removeSelectedItem}
              className="flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-1 text-[11px] font-bold text-red-600 transition active:scale-95"
            >
              <Trash2 size={12} />
              <span>Remove</span>
            </button>
          </div>

          <div className="grid grid-cols-5 gap-1.5">
            <button
              onClick={() => moveSelectedItem(-0.5, 0.5)}
              aria-label="Move Left"
              className="flex items-center justify-center rounded-xl bg-[#17233F]/6 py-2.5 text-[#17233F] active:bg-[#17233F]/15"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={() => moveSelectedItem(-0.5, -0.5)}
              aria-label="Move Up"
              className="flex items-center justify-center rounded-xl bg-[#17233F]/6 py-2.5 text-[#17233F] active:bg-[#17233F]/15"
            >
              <ArrowUp size={16} />
            </button>
            <button
              onClick={() => moveSelectedItem(0.5, 0.5)}
              aria-label="Move Down"
              className="flex items-center justify-center rounded-xl bg-[#17233F]/6 py-2.5 text-[#17233F] active:bg-[#17233F]/15"
            >
              <ArrowDown size={16} />
            </button>
            <button
              onClick={() => moveSelectedItem(0.5, -0.5)}
              aria-label="Move Right"
              className="flex items-center justify-center rounded-xl bg-[#17233F]/6 py-2.5 text-[#17233F] active:bg-[#17233F]/15"
            >
              <ArrowRight size={16} />
            </button>
            <button
              onClick={rotateSelectedItem}
              aria-label="Rotate 90 degrees"
              className="flex items-center justify-center gap-1 rounded-xl bg-[#FF5A1F] py-2.5 text-xs font-bold text-white shadow-sm active:scale-95"
            >
              <RotateCw size={15} />
              <span>90°</span>
            </button>
          </div>
        </div>
      )}

      {/* Bottom Tabbed Catalog Sheet */}
      <div className="pointer-events-auto w-full max-w-xl rounded-t-3xl border border-white/70 bg-white/92 p-3.5 shadow-[0_-10px_30px_rgba(23,35,63,0.14)] backdrop-blur-xl sm:mb-4 sm:rounded-3xl">
        {/* Top Row: Style Collection Filter (All / Blocky / Low-Poly) */}
        <div className="mb-2.5 grid grid-cols-3 gap-1 rounded-full bg-[#17233F]/6 p-1">
          {STYLE_FILTERS.map(({ id, label, icon: Icon }) => {
            const active = styleFilter === id;
            return (
              <button
                key={id}
                onClick={() => setStyleFilter(id)}
                className={`flex items-center justify-center gap-1.5 rounded-full py-1.5 text-[11px] font-bold transition ${
                  active
                    ? id === "lowpoly"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-[#FF5A1F] text-white shadow-sm"
                    : "text-[#17233F]/65 hover:text-[#17233F]"
                }`}
              >
                <Icon size={13} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Second Row: Category Tabs */}
        <div className="mb-3 flex gap-1.5 overflow-x-auto">
          {ROOM_CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.id] || Sofa;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-xs font-bold transition ${
                  isActive
                    ? "bg-[#17233F] text-white shadow-sm"
                    : "bg-[#17233F]/5 text-[#17233F]/70"
                }`}
              >
                <Icon size={14} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Horizontal Scrollable 3D Thumbnail Cards */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {visibleItems.map((item) => {
            const isLowPoly = item.style === "lowpoly";
            const previewSrc = thumbnails.get(item.id);

            return (
              <button
                key={item.id}
                onClick={() => addRoomItem(item.id)}
                className="flex min-w-[6.4rem] flex-1 flex-col items-center justify-between rounded-2xl border border-[#17233F]/8 bg-[#17233F]/[0.03] px-2 py-2 text-center transition hover:bg-[#FF5A1F]/10 active:scale-95"
              >
                <span
                  className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
                    isLowPoly
                      ? "bg-emerald-500/15 text-emerald-700"
                      : "bg-[#17233F]/8 text-[#17233F]/60"
                  }`}
                >
                  {isLowPoly ? "Low-Poly" : "Blocky"}
                </span>

                <div className="my-1 flex h-14 w-14 items-center justify-center">
                  {previewSrc ? (
                    <img
                      src={previewSrc}
                      alt={item.label}
                      draggable={false}
                      className="h-full w-full object-contain drop-shadow-[0_4px_6px_rgba(23,35,63,0.16)]"
                    />
                  ) : (
                    <div className="h-10 w-10 animate-pulse rounded-xl bg-[#17233F]/8" />
                  )}
                </div>

                <span className="text-xs font-bold leading-tight text-[#17233F]">
                  {item.label}
                </span>
                <span className="mt-0.5 inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#FF5A1F]">
                  <Plus size={11} />
                  Place
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
