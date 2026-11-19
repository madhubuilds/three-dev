import { useEffect, useState } from "react";
import { useAvatarStore } from "../../store/useAvatarStore";

const THEMES = ["cozy", "studio", "midnight"];
const STATUSES = ["Online", "Chilling", "Building", "AFK"];

export function InteractionPrompt() {
  const {
    username,
    bio,
    setBio,
    status,
    setStatus,
    roomTheme,
    setRoomTheme,
    setAnimation,
    nearbyProp,
    activeProp,
    setActiveProp,
  } = useAvatarStore();

  const [lineIndex, setLineIndex] = useState(0);

  // Reset conversation to first line whenever a new NPC is opened
  useEffect(() => {
    setLineIndex(0);
  }, [activeProp?.id]);

  const handleWaveBack = () => {
    setActiveProp(null);
    setAnimation("wave");
    setTimeout(() => setAnimation("idle"), 2000);
  };

  return (
    <>
      {/* Bottom-Right Contextual Action Button */}
      {nearbyProp && !activeProp && (
        <button
          onClick={() => setActiveProp(nearbyProp)}
          className="pointer-events-auto fixed right-5 bottom-9 z-20 border-2 border-[#080808] bg-[#FFE600] px-4 py-3 text-xs font-black uppercase text-[#080808] shadow-[4px_4px_0px_#080808] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
          {nearbyProp.actionLabel}
        </button>
      )}

      {/* NPC Dialogue Modal */}
      {activeProp?.type === "npc" && (
        <div className="pointer-events-auto fixed inset-0 z-30 flex items-end justify-center bg-black/35 p-4 sm:items-center">
          <div className="w-full max-w-sm border-2 border-[#080808] bg-white p-5 shadow-[6px_6px_0px_#080808]">
            <div className="mb-3 flex items-center justify-between">
              <span className="border-2 border-[#080808] bg-[#FFE600] px-2.5 py-0.5 text-xs font-black uppercase text-[#080808]">
                {activeProp.name}
              </span>
              <span className="text-[11px] font-black text-neutral-400">
                {lineIndex + 1} / {activeProp.dialogue.length}
              </span>
            </div>

            <p className="mb-5 min-h-[3.5rem] text-sm font-bold leading-relaxed text-[#080808]">
              "{activeProp.dialogue[lineIndex]}"
            </p>

            <div className="flex gap-2">
              {lineIndex < activeProp.dialogue.length - 1 ? (
                <button
                  onClick={() => setLineIndex((i) => i + 1)}
                  className="flex-1 border-2 border-[#080808] bg-[#FF5A1F] py-2.5 text-xs font-black uppercase text-white shadow-[3px_3px_0px_#080808] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleWaveBack}
                  className="flex-1 border-2 border-[#080808] bg-[#FFE600] py-2.5 text-xs font-black uppercase text-[#080808] shadow-[3px_3px_0px_#080808] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                >
                  Wave Back
                </button>
              )}

              <button
                onClick={() => setActiveProp(null)}
                className="border-2 border-[#080808] bg-[#17233F] px-4 py-2.5 text-xs font-black uppercase text-white shadow-[3px_3px_0px_#080808]"
              >
                Bye
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Desk Modal */}
      {activeProp?.type === "profile" && (
        <div className="pointer-events-auto fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xs border-2 border-[#080808] bg-white p-5 shadow-[6px_6px_0px_#080808]">
            <div className="mb-3 flex items-center justify-between">
              <span className="bg-[#080808] px-2 py-0.5 text-xs font-black text-[#FFE600]">
                @{username}
              </span>
              <button
                onClick={() => setActiveProp(null)}
                className="border-2 border-[#080808] bg-[#FF5A1F] px-2 py-0.5 text-xs font-black text-white"
              >
                X
              </button>
            </div>

            <p className="mb-1 text-[11px] font-black uppercase">Status</p>
            <div className="mb-3 flex gap-1.5">
              {STATUSES.map((st) => (
                <button
                  key={st}
                  onClick={() => setStatus(st)}
                  className={`flex-1 border-2 border-[#080808] py-1 text-[11px] font-black uppercase ${
                    status === st
                      ? "bg-[#FFE600] text-[#080808]"
                      : "bg-white text-neutral-500"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <p className="mb-1 text-[11px] font-black uppercase">Bio</p>
            <textarea
              rows={2}
              maxLength={80}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="mb-3 w-full resize-none border-2 border-[#080808] p-2 text-xs font-bold outline-none"
            />

            <p className="mb-1 text-[11px] font-black uppercase">Room Theme</p>
            <div className="mb-4 flex gap-1.5">
              {THEMES.map((t) => (
                <button
                  key={t}
                  onClick={() => setRoomTheme(t)}
                  className={`flex-1 border-2 border-[#080808] py-1.5 text-xs font-black uppercase ${
                    roomTheme === t
                      ? "bg-[#FF5A1F] text-white shadow-[2px_2px_0px_#080808]"
                      : "bg-white text-[#080808]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              onClick={() => setActiveProp(null)}
              className="w-full border-2 border-[#080808] bg-[#17233F] py-2 text-xs font-black uppercase text-white shadow-[3px_3px_0px_#080808]"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Standard Prop Modal (Bench, etc.) */}
      {activeProp &&
        activeProp.type !== "profile" &&
        activeProp.type !== "npc" && (
          <div className="pointer-events-auto fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-xs border-2 border-[#080808] bg-white p-5 shadow-[6px_6px_0px_#080808]">
              <div className="mb-2 flex items-start justify-between gap-2">
                <h2 className="text-base font-black uppercase text-[#080808]">
                  {activeProp.title}
                </h2>
                <button
                  onClick={() => setActiveProp(null)}
                  className="border-2 border-[#080808] bg-[#FF5A1F] px-2 py-0.5 text-xs font-black text-white"
                >
                  X
                </button>
              </div>
              <p className="mb-4 text-sm font-medium text-neutral-700">
                {activeProp.description}
              </p>
              <button
                onClick={() => setActiveProp(null)}
                className="w-full border-2 border-[#080808] bg-[#17233F] py-2 text-xs font-black uppercase text-white shadow-[3px_3px_0px_#080808]"
              >
                Got It
              </button>
            </div>
          </div>
        )}
    </>
  );
}