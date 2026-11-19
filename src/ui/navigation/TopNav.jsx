import { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  Armchair,
  Box,
  Check,
  MessageCircle,
  Orbit,
  Send,
  Video,
  X,
} from "lucide-react";
import { useAvatarStore } from "../../store/useAvatarStore";

const CAMERA_OPTIONS = [
  { id: "iso", label: "Iso", icon: Box },
  { id: "orbit", label: "3D", icon: Orbit },
  { id: "follow", label: "Follow", icon: Video },
];

export function TopNav() {
  const { pathname } = useLocation();
  const isRoom = pathname === "/";

  const {
    username,
    status,
    setChatMessage,
    setActiveProp,
    isDecorating,
    setIsDecorating,
    cameraMode,
    setCameraMode,
  } = useAvatarStore();

  const [chatOpen, setChatOpen] = useState(false);
  const [input, setInput] = useState("");
  const timerRef = useRef(null);

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setChatMessage(input.trim());
    setInput("");
    setChatOpen(false);

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setChatMessage(""), 4000);
  };

  return (
    <header className="pointer-events-none fixed top-0 right-0 left-0 z-20 p-3.5 sm:p-5">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-2">
        {/* Left: Frosted Profile Pill */}
        <button
          onClick={() => setActiveProp({ id: "profile-desk", type: "profile" })}
          className="pointer-events-auto flex items-center gap-2.5 rounded-full border border-white/60 bg-white/80 px-3.5 py-2 shadow-[0_8px_24px_rgba(23,35,63,0.12)] backdrop-blur-md transition active:scale-95"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
          <span className="text-xs font-bold tracking-tight text-[#17233F]">
            @{username || "you"}
          </span>
          <span className="hidden rounded-full bg-[#17233F]/8 px-2 py-0.5 text-[10px] font-semibold text-[#17233F]/70 sm:inline">
            {status}
          </span>
        </button>

        {/* Right: Camera Switcher, Decor & Quick Chat */}
        <div className="pointer-events-auto flex items-center gap-1.5">
          {/* Frosted 3-Mode Camera Switcher */}
          {!isDecorating && (
            <div className="flex items-center rounded-full border border-white/60 bg-white/80 p-1 shadow-[0_8px_24px_rgba(23,35,63,0.12)] backdrop-blur-md">
              {CAMERA_OPTIONS.map(({ id, label, icon: Icon }) => {
                const active = cameraMode === id;
                return (
                  <button
                    key={id}
                    onClick={() => setCameraMode(id)}
                    className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold transition ${
                      active
                        ? "bg-[#17233F] text-white shadow-sm"
                        : "text-[#17233F]/70 hover:text-[#17233F]"
                    }`}
                  >
                    <Icon size={13} />
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {isRoom && (
            <button
              onClick={() => {
                setChatOpen(false);
                if (!isDecorating && cameraMode === "follow") {
                  setCameraMode("iso");
                }
                setIsDecorating(!isDecorating);
              }}
              className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-bold shadow-[0_8px_24px_rgba(23,35,63,0.12)] backdrop-blur-md transition active:scale-95 ${
                isDecorating
                  ? "border-[#17233F] bg-[#17233F] text-white"
                  : "border-white/60 bg-white/80 text-[#17233F]"
              }`}
            >
              {isDecorating ? <Check size={15} /> : <Armchair size={15} />}
              <span>{isDecorating ? "Done" : "Decor"}</span>
            </button>
          )}

          {!isDecorating && (
            <button
              onClick={() => setChatOpen((o) => !o)}
              aria-label="Toggle quick chat"
              className={`flex h-9 w-9 items-center justify-center rounded-full border shadow-[0_8px_24px_rgba(23,35,63,0.12)] backdrop-blur-md transition active:scale-95 ${
                chatOpen
                  ? "border-[#FF5A1F] bg-[#FF5A1F] text-white"
                  : "border-white/60 bg-white/80 text-[#17233F]"
              }`}
            >
              {chatOpen ? <X size={16} /> : <MessageCircle size={16} />}
            </button>
          )}
        </div>
      </div>

      {/* Floating Quick-Chat Bubble Input */}
      {chatOpen && !isDecorating && (
        <form
          onSubmit={handleSendChat}
          className="pointer-events-auto mx-auto mt-3 flex max-w-sm items-center gap-1.5 rounded-full border border-white/70 bg-white/90 p-1.5 pl-4 shadow-[0_12px_32px_rgba(23,35,63,0.16)] backdrop-blur-md"
        >
          <input
            type="text"
            autoFocus
            maxLength={60}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Say something to the room..."
            className="flex-1 bg-transparent text-xs font-medium text-[#17233F] placeholder:text-[#17233F]/45 outline-none"
          />
          <button
            type="submit"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF5A1F] text-white shadow-sm transition active:scale-90"
          >
            <Send size={14} />
          </button>
        </form>
      )}
    </header>
  );
}