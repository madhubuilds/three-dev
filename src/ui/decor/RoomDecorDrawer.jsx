import { useState } from "react";
import { useAvatarStore } from "../../store/useAvatarStore";
import { ROOM_CATEGORIES, ROOM_ITEMS, getCatalogItem } from "../../data/roomCatalog";

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
      {/* Selected Item Move & 90° Rotate Controls */}
      {selectedItem && (
        <div className="pointer-events-auto mb-2.5 w-[calc(100%-1.5rem)] max-w-md border-2 border-[#080808] bg-[#FFE600] p-2.5 shadow-[4px_4px_0px_#080808]">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-black uppercase text-[#080808]">
              Moving: {selectedMeta?.label}
            </span>
            <button
              onClick={removeSelectedItem}
              className="border-2 border-[#080808] bg-[#FF5A1F] px-2 py-0.5 text-[11px] font-black uppercase text-white"
            >
              Remove
            </button>
          </div>

          <div className="grid grid-cols-5 gap-1.5">
            {/* Screen-aligned isometric nudges */}
            <button
              onClick={() => moveSelectedItem(-0.5, 0.5)}
              className="border-2 border-[#080808] bg-white py-2 text-xs font-black uppercase active:bg-neutral-200"
            >
              Left
            </button>
            <button
              onClick={() => moveSelectedItem(-0.5, -0.5)}
              className="border-2 border-[#080808] bg-white py-2 text-xs font-black uppercase active:bg-neutral-200"
            >
              Up
            </button>
            <button
              onClick={() => moveSelectedItem(0.5, 0.5)}
              className="border-2 border-[#080808] bg-white py-2 text-xs font-black uppercase active:bg-neutral-200"
            >
              Down
            </button>
            <button
              onClick={() => moveSelectedItem(0.5, -0.5)}
              className="border-2 border-[#080808] bg-white py-2 text-xs font-black uppercase active:bg-neutral-200"
            >
              Right
            </button>
            <button
              onClick={rotateSelectedItem}
              className="border-2 border-[#080808] bg-[#17233F] py-2 text-xs font-black uppercase text-white active:opacity-90"
            >
              90°
            </button>
          </div>
        </div>
      )}

      {/* Bottom Tabbed Inventory Panel */}
      <div className="pointer-events-auto w-full max-w-xl border-t-3 border-[#080808] bg-white p-3 sm:mb-3 sm:border-2 sm:shadow-[4px_4px_0px_#080808]">
        {/* Category Tabs */}
        <div className="mb-2.5 flex gap-1.5 overflow-x-auto">
          {ROOM_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex-1 border-2 border-[#080808] px-3 py-1.5 text-xs font-black uppercase transition-colors ${
                activeTab === cat.id
                  ? "bg-[#FF5A1F] text-white shadow-[2px_2px_0px_#080808]"
                  : "bg-[#f4f4f0] text-[#080808]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Variants Grid */}
        <div className="grid grid-cols-3 gap-2">
          {tabItems.map((item) => (
            <button
              key={item.id}
              onClick={() => addRoomItem(item.id)}
              className="flex flex-col items-center justify-center border-2 border-[#080808] bg-[#f4f4f0] px-2 py-2.5 text-center shadow-[2px_2px_0px_#080808] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
              <span className="text-xs font-black uppercase text-[#080808]">
                {item.label}
              </span>
              <span className="mt-0.5 text-[10px] font-bold text-neutral-500">
                + Place
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}