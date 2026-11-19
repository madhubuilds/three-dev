import { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAvatarStore } from "../../store/useAvatarStore";

export function TopNav() {
  const { pathname } = useLocation();
  const isRoom = pathname === "/";
  const isPlaza = pathname === "/plaza";

  const {
    username,
    status,
    setChatMessage,
    setActiveProp,
    setNearbyProp,
    isDecorating,
    setIsDecorating,
  } = useAvatarStore();

  const [chatOpen, setChatOpen] = useState(false);
  const [input, setInput] = useState("");
  const timerRef = useRef(null);

  const handleRouteSwitch = () => {
    setIsDecorating(false);
    setNearbyProp(null);
    setActiveProp(null);
  };

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
    <header className="pointer-events-none fixed top-0 right-0 left-0 z-20 p-3 sm:p-4">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-2">
        {/* Left: User Identity & Room / Plaza Switcher */}
        <div className="pointer-events-auto flex items-center gap-1.5">
          <button
            onClick={() => setActiveProp({ id: "profile-desk", type: "profile" })}
            className="flex items-center gap-2 border-2 border-[#080808] bg-white px-2.5 py-1.5 text-left shadow-[3px_3px_0px_#080808] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            <span className="h-2.5 w-2.5 rounded-full border border-[#080808] bg-[#22C55E]" />
            <span className="text-xs font-black tracking-tight text-[#080808]">
              @{username || "you"}
            </span>
            <span className="hidden border-l-2 border-[#080808] pl-2 text-[10px] font-black uppercase text-neutral-500 md:inline">
              {status}
            </span>
          </button>

          <Link
            to="/"
            onClick={handleRouteSwitch}
            className={`border-2 border-[#080808] px-2.5 py-1.5 text-xs font-black uppercase shadow-[3px_3px_0px_#080808] ${
              isRoom ? "bg-[#FF5A1F] text-white" : "bg-white text-[#080808]"
            }`}
          >
            Room
          </Link>

          <Link
            to="/plaza"
            onClick={handleRouteSwitch}
            className={`border-2 border-[#080808] px-2.5 py-1.5 text-xs font-black uppercase shadow-[3px_3px_0px_#080808] ${
              isPlaza ? "bg-[#FF5A1F] text-white" : "bg-white text-[#080808]"
            }`}
          >
            Plaza
          </Link>
        </div>

        {/* Right: Decor (Room only), Quick Chat & Avatar Studio */}
        <div className="pointer-events-auto flex items-center gap-1.5">
          {isRoom && (
            <button
              onClick={() => setIsDecorating(!isDecorating)}
              className={`border-2 border-[#080808] px-2.5 py-1.5 text-xs font-black uppercase shadow-[3px_3px_0px_#080808] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
                isDecorating ? "bg-[#17233F] text-white" : "bg-white text-[#080808]"
              }`}
            >
              {isDecorating ? "Done" : "Decor"}
            </button>
          )}

          <button
            onClick={() => setChatOpen((o) => !o)}
            className={`border-2 border-[#080808] px-2.5 py-1.5 text-xs font-black uppercase shadow-[3px_3px_0px_#080808] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
              chatOpen ? "bg-[#FF5A1F] text-white" : "bg-white text-[#080808]"
            }`}
          >
            {chatOpen ? "Close" : "Chat"}
          </button>

          <Link
            to="/avatar"
            onClick={handleRouteSwitch}
            className="border-2 border-[#080808] bg-[#FFE600] px-2.5 py-1.5 text-xs font-black uppercase text-[#080808] shadow-[3px_3px_0px_#080808] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            Avatar
          </Link>
        </div>
      </div>

      {/* Collapsible Top Chat Input */}
      {chatOpen && (
        <form
          onSubmit={handleSendChat}
          className="pointer-events-auto mx-auto mt-2.5 flex max-w-sm gap-2"
        >
          <input
            type="text"
            autoFocus
            maxLength={60}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Say something..."
            className="flex-1 border-2 border-[#080808] bg-white px-3 py-1.5 text-xs font-bold text-[#080808] shadow-[3px_3px_0px_#080808] outline-none"
          />
          <button
            type="submit"
            className="border-2 border-[#080808] bg-[#17233F] px-3.5 py-1.5 text-xs font-black uppercase text-white shadow-[3px_3px_0px_#080808]"
          >
            Send
          </button>
        </form>
      )}
    </header>
  );
}