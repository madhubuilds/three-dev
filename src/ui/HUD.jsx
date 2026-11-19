import { TopNav } from "./navigation/TopNav";
import { Joystick } from "./controls/Joystick";
import { InteractionPrompt } from "./interactions/InteractionPrompt";
import { RoomDecorDrawer } from "./decor/RoomDecorDrawer";
import { useAvatarStore } from "../store/useAvatarStore";
export function HUD() {
  const isDecorating = useAvatarStore((s) => s.isDecorating);
  return (
    <div className="pointer-events-none fixed inset-0 z-10">
      <TopNav />

      <div className={isDecorating ? "block" : "hidden"}>
        <RoomDecorDrawer />
      </div>

      <div className={isDecorating ? "hidden" : "block"}>
        <Joystick />
        <InteractionPrompt />
      </div>
    </div>
  );
}
