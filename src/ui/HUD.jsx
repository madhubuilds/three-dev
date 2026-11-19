import { Link } from "react-router-dom";
import { ChatBar } from "./chat/ChatBar";
import { Joystick } from "./controls/Joystick";
import { InteractionPrompt } from "./interactions/InteractionPrompt";
import { TopNav } from "./navigation/TopNav";

export function HUD() {
  return (
    <div className="pointer-events-none fixed inset-0 z-10">
      <TopNav />

      <Joystick />
      <InteractionPrompt />
    </div>
  );
}
