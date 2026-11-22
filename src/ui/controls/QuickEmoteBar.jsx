import { useRef } from "react";
import { Armchair, Hand, Music, PartyPopper } from "lucide-react";
import { useAvatarStore } from "../../store/useAvatarStore";

const EMOTES = [
  { id: "wave", label: "Wave", icon: Hand, timed: true },
  { id: "cheer", label: "Cheer", icon: PartyPopper, timed: true },
  { id: "dance", label: "Dance", icon: Music, timed: true },
  { id: "sit", label: "Sit", icon: Armchair, timed: false },
];

export function QuickEmoteBar() {
  const animation = useAvatarStore((s) => s.animation);
  const triggerEmote = useAvatarStore((s) => s.triggerEmote);
  const standUp = useAvatarStore((s) => s.standUp);
  const timerRef = useRef(null);

  const handleEmote = (emote) => {
    clearTimeout(timerRef.current);

    // Toggle off if tapping the currently active emote
    if (animation === emote.id) {
      if (emote.id === "sit") standUp();
      else triggerEmote("idle");
      return;
    }

    triggerEmote(emote.id);

    if (emote.timed) {
      timerRef.current = setTimeout(() => {
        if (useAvatarStore.getState().animation === emote.id) {
          triggerEmote("idle");
        }
      }, 2400);
    }
  };

  return (
    <div className="pointer-events-auto fixed bottom-[4.65rem] left-1/2 z-20 -translate-x-1/2">
      <div className="flex items-center gap-1 rounded-full border border-white/60 bg-white/75 p-1 shadow-[0_8px_20px_rgba(23,35,63,0.12)] backdrop-blur-md">
        {EMOTES.map((emote) => {
          const Icon = emote.icon;
          const active = animation === emote.id;
          return (
            <button
              key={emote.id}
              onClick={() => handleEmote(emote)}
              aria-label={emote.label}
              title={emote.label}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition active:scale-90 ${
                active
                  ? "bg-[#FF5A1F] text-white shadow-sm"
                  : "text-[#17233F]/75 hover:bg-black/5 hover:text-[#17233F]"
              }`}
            >
              <Icon size={15} strokeWidth={2.3} />
            </button>
          );
        })}
      </div>
    </div>
  );
}