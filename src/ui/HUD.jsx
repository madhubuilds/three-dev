import { AvatarControls } from "./avatar/AvatarControls";
import { ChatBar } from "./chat/ChatBar";
import { Joystick } from "./controls/Joystick";
import { InteractionPrompt } from "./interactions/InteractionPrompt";

export function HUD() {
  return (
    /* pointer-events-none lets touches pass through to the 3D canvas */
    <div className="pointer-events-none fixed inset-0 z-10">
      <AvatarControls />
      <Joystick />
      <ChatBar />
      <InteractionPrompt />
    </div>
  );
}
