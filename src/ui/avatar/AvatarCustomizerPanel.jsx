import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAvatarStore } from "../../store/useAvatarStore";

const ANIMATIONS = ["idle", "walk", "wave"];
const COLOR_PARTS = [
  { key: "skin", label: "Skin" },
  { key: "hair", label: "Hair" },
  { key: "shirt", label: "Shirt" },
  { key: "pants", label: "Pants" },
];

const TABS = [
  { id: "info", label: "Info" },
  { id: "hair", label: "Hair", options: ["none", "classic", "spiky", "mohawk", "bob", "afro"] },
  { id: "hat", label: "Hats", options: ["none", "cap", "beanie", "tophat", "crown"] },
  { id: "glasses", label: "Glasses", options: ["none", "shades", "visor"] },
  { id: "eyes", label: "Eyes", options: ["classic", "happy", "angry", "cyber"] },
  { id: "nose", label: "Nose", options: ["none", "button", "blocky", "long", "round"] },
  { id: "mouth", label: "Mouth", options: ["smile", "neutral", "open", "smirk"] },
  { id: "mustache", label: "Stache", options: ["none", "classic", "handlebar", "walrus", "goatee"] },
  { id: "colors", label: "Colors" },
];

export function AvatarCustomizerPanel() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("hair");
  const {
    username,
    setUsername,
    animation,
    setAnimation,
    colors,
    setColor,
    accessories,
    setAccessory,
  } = useAvatarStore();

  const currentTab = TABS.find((t) => t.id === activeTab);

  return (
    <div className="flex h-full flex-col justify-between border-t-3 border-[#080808] bg-white md:border-t-0 md:border-l-3">
      {/* Header + Horizontal Scrollable Tabs */}
      <div className="border-b-2 border-[#080808] bg-[#f4f4f0] p-4 pb-3">
        <div className="mb-3 flex items-baseline justify-between">
          <h1 className="text-lg font-black uppercase tracking-tight text-[#080808]">
            Avatar Studio
          </h1>
          <span className="text-[11px] font-bold text-neutral-500">
            Drag to rotate 360°
          </span>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 border-2 border-[#080808] px-3 py-1.5 text-xs font-black uppercase transition-colors ${
                activeTab === tab.id
                  ? "bg-[#FFE600] text-[#080808] shadow-[2px_2px_0px_#080808]"
                  : "bg-white text-neutral-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "info" && (
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-black uppercase">
                Username
              </label>
              <input
                type="text"
                maxLength={16}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your_name"
                className="w-full border-2 border-[#080808] px-3 py-2 text-sm font-bold shadow-[3px_3px_0px_#080808] outline-none"
              />
            </div>

            <div>
              <p className="mb-1.5 text-xs font-black uppercase">Preview Pose</p>
              <div className="flex gap-2">
                {ANIMATIONS.map((anim) => (
                  <button
                    key={anim}
                    onClick={() => setAnimation(anim)}
                    className={`flex-1 border-2 border-[#080808] py-2 text-xs font-black uppercase ${
                      animation === anim
                        ? "bg-[#FF5A1F] text-white shadow-[2px_2px_0px_#080808]"
                        : "bg-white text-[#080808]"
                    }`}
                  >
                    {anim}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "colors" && (
          <div className="grid grid-cols-2 gap-3">
            {COLOR_PARTS.map(({ key, label }) => (
              <label
                key={key}
                className="flex cursor-pointer items-center justify-between border-2 border-[#080808] bg-[#f4f4f0] px-3 py-2.5 text-xs font-black uppercase"
              >
                {label}
                <input
                  type="color"
                  value={colors[key]}
                  onChange={(e) => setColor(key, e.target.value)}
                  className="h-6 w-8 cursor-pointer border-2 border-[#080808] p-0"
                />
              </label>
            ))}
          </div>
        )}

        {currentTab?.options && (
          <div className="grid grid-cols-2 gap-2.5">
            {currentTab.options.map((opt) => (
              <button
                key={opt}
                onClick={() => setAccessory(currentTab.id, opt)}
                className={`border-2 border-[#080808] py-2.5 text-xs font-black uppercase transition-colors ${
                  accessories[currentTab.id] === opt
                    ? "bg-[#FF5A1F] text-white shadow-[3px_3px_0px_#080808]"
                    : "bg-white text-[#080808]"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="border-t-2 border-[#080808] p-4">
        <button
          onClick={() => navigate("/")}
          className="w-full border-2 border-[#080808] bg-[#17233F] py-3 text-sm font-black uppercase text-white shadow-[4px_4px_0px_#080808] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
          Save & Enter World
        </button>
      </div>
    </div>
  );
}