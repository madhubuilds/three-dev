import { Link } from "react-router-dom";
import { ChatBar } from "./chat/ChatBar";
import { Joystick } from "./controls/Joystick";
import { InteractionPrompt } from "./interactions/InteractionPrompt";

export function HUD() {
  return (
    <div className="pointer-events-none fixed inset-0 z-10">
      <Link
        to="/avatar"
        className="pointer-events-auto fixed top-4 left-4 z-20 border-2 border-[#080808] bg-[#FFE600] px-3 py-1.5 text-xs font-black uppercase text-[#080808] shadow-[3px_3px_0px_#080808] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
      >
        Edit Avatar
      </Link>

      <Joystick />
      <InteractionPrompt />
      <ChatBar />
    </div>
  );
}
