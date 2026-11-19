import { useState } from "react";
import { useAvatarStore } from "../../store/useAvatarStore";

const ANIMATIONS = ["idle", "walk", "wave"];
const PARTS = [
  { key: "skin", label: "Skin" },
  { key: "hair", label: "Hair" },
  { key: "shirt", label: "Shirt" },
  { key: "pants", label: "Pants" },
];

export function AvatarControls() {
  const [open, setOpen] = useState(false);
  const { animation, setAnimation, colors, setColor } = useAvatarStore();

  return (
    <div className="pointer-events-auto fixed top-4 left-4 z-20">
      {/* Mobile-first toggle button */}
     <button
        on Click={() => setOpen((o) => !o)}
        className="border-2 border-[#080808] bg-[#FFE600] px-3 py-1.5 text-xs font-black uppercase shadow-[3px_3px_0px_#080808] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
      >
        {open ? "Close" : "Customize"}
      </button>

      {open && (
        <div className="mt-2 w-56 border-2 border-[#080808] bg-white p-3.5 shadow-[4px_4px_0px_#080808]">
          <p className="mb-2 text-xs font-black uppercase tracking-wide">
            Animation
          </p>
          <div className="mb-4 flex gap-1.5">
            {ANIMATIONS.map((anim) => (
              <button
                key={anim}
                onClick={() => setAnimation(anim)}
                className={`flex-1 border-2 border-[#080808] py-1 text-xs font-bold capitalize transition-colors ${
                  animation === anim
                    ? "bg-[#FF5A1F] text-white"
                    : "bg-white text-[#080808]"
                }`}
              >
                {anim}
              </button>
            ))}
          </div>

          <p className="mb-2 text-xs font-black uppercase tracking-wide">
            Outfit
          </p>
          <div className="flex flex-col gap-2">
            {PARTS.map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center justify-between text-xs font-bold"
              >
                {label}
                <input
                  type="color"
                  value={colors[key]}
                  onChange={(e) => setColor(key, e.target.value)}
                  className="h-6 w-9 cursor-pointer border-2 border-[#080808] p-0"
                />
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
