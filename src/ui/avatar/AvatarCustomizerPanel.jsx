import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  CircleDot,
  Crown,
  Eye,
  Glasses,
  Palette,
  Scissors,
  Smile,
  Sparkles,
  User,
} from "lucide-react";
import { useAvatarStore } from "../../store/useAvatarStore";

const ANIMATIONS = ["idle", "walk", "wave"];
const COLOR_PARTS = [
  { key: "skin", label: "Skin" },
  { key: "hair", label: "Hair" },
  { key: "shirt", label: "Shirt" },
  { key: "pants", label: "Pants" },
];

const TABS = [
  { id: "info", label: "Info", icon: User },
  {
    id: "hair",
    label: "Hair",
    icon: Scissors,
    options: ["none", "classic", "spiky", "mohawk", "bob", "afro"],
  },
  {
    id: "hat",
    label: "Hats",
    icon: Crown,
    options: ["none", "cap", "beanie", "tophat", "crown"],
  },
  {
    id: "glasses",
    label: "Glasses",
    icon: Glasses,
    options: ["none", "shades", "visor"],
  },
  {
    id: "eyes",
    label: "Eyes",
    icon: Eye,
    options: ["classic", "happy", "angry", "cyber"],
  },
  {
    id: "nose",
    label: "Nose",
    icon: CircleDot,
    options: ["none", "button", "blocky", "long", "round"],
  },
  {
    id: "mouth",
    label: "Mouth",
    icon: Smile,
    options: ["smile", "neutral", "open", "smirk"],
  },
  {
    id: "mustache",
    label: "Stache",
    icon: Sparkles,
    options: ["none", "classic", "handlebar", "walrus", "goatee"],
  },
  { id: "colors", label: "Colors", icon: Palette },
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
    <div className="flex h-full flex-col justify-between rounded-t-3xl border-t border-white/70 bg-white/92 shadow-[0_-10px_30px_rgba(23,35,63,0.12)] backdrop-blur-xl md:rounded-none md:border-t-0 md:border-l md:border-[#17233F]/10">
      {/* Header + Horizontal Pill Tabs */}
      <div className="border-b border-[#17233F]/8 px-4 pt-4 pb-3">
        <div className="mb-3 flex items-center justify-between">
          <h1 className="text-base font-bold tracking-tight text-[#17233F]">
            Avatar Studio
          </h1>
          <span className="rounded-full bg-[#17233F]/6 px-2.5 py-0.5 text-[11px] font-semibold text-[#17233F]/60">
            Drag to rotate 360°
          </span>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                  isActive
                    ? "bg-[#17233F] text-white shadow-sm"
                    : "bg-[#17233F]/5 text-[#17233F]/70 hover:bg-[#17233F]/10"
                }`}
              >
                <Icon size={13} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "info" && (
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#17233F]/50">
                Username
              </label>
              <input
                type="text"
                maxLength={16}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your_name"
                className="w-full rounded-2xl border border-[#17233F]/12 bg-[#17233F]/[0.03] px-3.5 py-2.5 text-sm font-semibold text-[#17233F] outline-none focus:border-[#FF5A1F]"
              />
            </div>

            <div>
              <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-[#17233F]/50">
                Preview Pose
              </p>
              <div className="grid grid-cols-3 gap-1.5 rounded-2xl bg-[#17233F]/5 p-1">
                {ANIMATIONS.map((anim) => (
                  <button
                    key={anim}
                    onClick={() => setAnimation(anim)}
                    className={`rounded-xl py-2 text-xs font-bold capitalize transition ${
                      animation === anim
                        ? "bg-white text-[#17233F] shadow-sm"
                        : "text-[#17233F]/60"
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
          <div className="grid grid-cols-2 gap-2.5">
            {COLOR_PARTS.map(({ key, label }) => (
              <label
                key={key}
                className="flex cursor-pointer items-center justify-between rounded-2xl border border-[#17233F]/8 bg-[#17233F]/[0.03] px-3.5 py-3 text-xs font-bold text-[#17233F] transition hover:bg-[#17233F]/[0.06]"
              >
                <span>{label}</span>
                <span
                  style={{ backgroundColor: colors[key] }}
                  className="relative h-6 w-6 overflow-hidden rounded-full border-2 border-white shadow-sm"
                >
                  <input
                    type="color"
                    value={colors[key]}
                    onChange={(e) => setColor(key, e.target.value)}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  />
                </span>
              </label>
            ))}
          </div>
        )}

        {currentTab?.options && (
          <div className="grid grid-cols-2 gap-2">
            {currentTab.options.map((opt) => {
              const isSelected = accessories[currentTab.id] === opt;
              return (
                <button
                  key={opt}
                  onClick={() => setAccessory(currentTab.id, opt)}
                  className={`rounded-2xl py-3 text-xs font-bold capitalize transition active:scale-95 ${
                    isSelected
                      ? "bg-[#FF5A1F] text-white shadow-[0_6px_16px_rgba(255,90,31,0.3)]"
                      : "border border-[#17233F]/8 bg-[#17233F]/[0.03] text-[#17233F]/80 hover:bg-[#17233F]/[0.07]"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="border-t border-[#17233F]/8 p-4">
        <button
          onClick={() => navigate("/")}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#17233F] py-3 text-xs font-bold text-white shadow-[0_8px_20px_rgba(23,35,63,0.22)] transition active:scale-95"
        >
          <Check size={16} />
          <span>Save & Enter Room</span>
        </button>
      </div>
    </div>
  );
}
