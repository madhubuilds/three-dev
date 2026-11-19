import { useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Lamp,
  LayoutGrid,
  Plus,
  RotateCw,
  Sofa,
  Sprout,
  Trash2,
} from "lucide-react";
import { useAvatarStore } from "../../store/useAvatarStore";
import { ROOM_CATEGORIES, ROOM_ITEMS, getCatalogItem } from "../../data/roomCatalog";

const CATEGORY_ICONS = {
  sofa: Sofa,
  plants: Sprout,
  lamps: Lamp,
  tables: LayoutGrid,
};

export function RoomDecorDrawer() {
  const [activeTab, setActiveTab] = useState("sofa");
  const {
    isDecorating,
    placedItems,
    selectedInstanceId,
    addRoomItem,
    moveSelectedItem,
    rotateSelectedItem,
    removeSelectedItem,
  } = useAvatarStore();

  if (!isDecorating) return null;

  const selectedItem = placedItems.find((i) => i.instanceId === selectedInstanceId);
  const selectedMeta = selectedItem ? getCatalogItem(selectedItem.itemId) : null;
  const tabItems = ROOM_ITEMS.filter((item) => item.category === activeTab);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex flex-col items-center">
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

        <div className="grid grid-cols-3 gap-2">
          {tabItems.map((item) => (
            <button
              key={item.id}
              onClick={() => addRoomItem(item.id)}
              className="flex flex-col items-center justify-center rounded-2xl border border-[#17233F]/8 bg-[#17233F]/[0.03] px-2 py-2.5 text-center transition hover:bg-[#FF5A1F]/10 active:scale-95"
            >
              <span className="text-xs font-bold text-[#17233F]">
                {item.label}
              </span>
              <span className="mt-0.5 inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#FF5A1F]">
                <Plus size={11} />
                Place
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}