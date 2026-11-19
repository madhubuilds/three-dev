import { useEffect, useState } from "react";
import { ChevronRight, Hand, MessageSquare, Sparkles, X } from "lucide-react";
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
      {/* Bottom-Right Contextual Action Pill */}
      {nearbyProp && !activeProp && (
        <button
          onClick={() => setActiveProp(nearbyProp)}
          className="pointer-events-auto fixed right-5 bottom-24 z-20 flex items-center gap-2 rounded-full border border-white/40 bg-[#FF5A1F] px-4 py-3 text-xs font-bold text-white shadow-[0_10px_25px_rgba(255,90,31,0.38)] transition active:scale-95"
        >
          {nearbyProp.type === "npc" ? (
            <MessageSquare size={15} />
          ) : (
            <Sparkles size={15} />
          )}
          <span>{nearbyProp.actionLabel}</span>
        </button>
      )}

      {/* NPC Dialogue Card */}
      {activeProp?.type === "npc" && (
        <div className="pointer-events-auto fixed inset-0 z-30 flex items-end justify-center bg-[#17233F]/30 p-4 backdrop-blur-[2px] sm:items-center">
          <div className="w-full max-w-sm rounded-3xl border border-white/70 bg-white/95 p-5 shadow-2xl backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between">
              <span className="rounded-full bg-[#FF5A1F]/12 px-3 py-1 text-xs font-bold text-[#FF5A1F]">
                {activeProp.name}
              </span>
              <span className="text-[11px] font-semibold text-[#17233F]/45">
                {lineIndex + 1} / {activeProp.dialogue.length}
              </span>
            </div>

            <p className="mb-5 min-h-[3.25rem] text-sm font-medium leading-relaxed text-[#17233F]">
              "{activeProp.dialogue[lineIndex]}"
            </p>

            <div className="flex gap-2">
              {lineIndex < activeProp.dialogue.length - 1 ? (
                <button
                  onClick={() => setLineIndex((i) => i + 1)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#FF5A1F] py-2.5 text-xs font-bold text-white shadow-sm transition active:scale-95"
                >
                  <span>Next</span>
                  <ChevronRight size={15} />
                </button>
              ) : (
                <button
                  onClick={handleWaveBack}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#FFE600] py-2.5 text-xs font-bold text-[#17233F] shadow-sm transition active:scale-95"
                >
                  <Hand size={15} />
                  <span>Wave Back</span>
                </button>
              )}

              <button
                onClick={() => setActiveProp(null)}
                className="rounded-full bg-[#17233F]/8 px-4 py-2.5 text-xs font-bold text-[#17233F] transition hover:bg-[#17233F]/15"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Card Modal */}
      {activeProp?.type === "profile" && (
        <div className="pointer-events-auto fixed inset-0 z-30 flex items-center justify-center bg-[#17233F]/30 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-xs rounded-3xl border border-white/70 bg-white/95 p-5 shadow-2xl backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="rounded-full bg-[#17233F] px-3 py-1 text-xs font-bold text-white">
                @{username}
              </span>
              <button
                onClick={() => setActiveProp(null)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-[#17233F]/8 text-[#17233F] hover:bg-[#17233F]/15"
              >
                <X size={15} />
              </button>
            </div>

            <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-[#17233F]/50">
              Status
            </p>
            <div className="mb-3.5 grid grid-cols-4 gap-1 rounded-2xl bg-[#17233F]/5 p-1">
              {STATUSES.map((st) => (
                <button
                  key={st}
                  onClick={() => setStatus(st)}
                  className={`rounded-xl py-1.5 text-[11px] font-bold transition ${
                    status === st
                      ? "bg-white text-[#17233F] shadow-sm"
                      : "text-[#17233F]/55"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-[#17233F]/50">
              Bio
            </p>
            <textarea
              rows={2}
              maxLength={80}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="mb-3.5 w-full resize-none rounded-2xl border border-[#17233F]/12 bg-[#17233F]/[0.03] p-2.5 text-xs font-medium text-[#17233F] outline-none focus:border-[#FF5A1F]"
            />

            <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-[#17233F]/50">
              Room Vibe
            </p>
            <div className="mb-5 grid grid-cols-3 gap-1.5">
              {THEMES.map((t) => (
                <button
                  key={t}
                  onClick={() => setRoomTheme(t)}
                  className={`rounded-xl py-2 text-xs font-bold capitalize transition ${
                    roomTheme === t
                      ? "bg-[#FF5A1F] text-white shadow-sm"
                      : "bg-[#17233F]/6 text-[#17233F]/75"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              onClick={() => setActiveProp(null)}
              className="w-full rounded-full bg-[#17233F] py-2.5 text-xs font-bold text-white shadow-md transition active:scale-95"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Standard Prop Modal */}
      {activeProp &&
        activeProp.type !== "profile" &&
        activeProp.type !== "npc" && (
          <div className="pointer-events-auto fixed inset-0 z-30 flex items-center justify-center bg-[#17233F]/30 p-4 backdrop-blur-[2px]">
            <div className="w-full max-w-xs rounded-3xl border border-white/70 bg-white/95 p-5 shadow-2xl backdrop-blur-xl">
              <div className="mb-2 flex items-center justify-between gap-2">
                <h2 className="text-base font-bold text-[#17233F]">
                  {activeProp.title}
                </h2>
                <button
                  onClick={() => setActiveProp(null)}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-[#17233F]/8 text-[#17233F]"
                >
                  <X size={15} />
                </button>
              </div>
              <p className="mb-4 text-xs font-medium leading-relaxed text-[#17233F]/75">
                {activeProp.description}
              </p>
              <button
                onClick={() => setActiveProp(null)}
                className="w-full rounded-full bg-[#17233F] py-2.5 text-xs font-bold text-white shadow-md"
              >
                Got It
              </button>
            </div>
          </div>
        )}
    </>
  );
}