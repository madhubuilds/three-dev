import { useRef, useState } from "react";
import { joystickInput } from "../../store/useAvatarStore";

const MAX_RADIUS = 36;

export function Joystick() {
  const baseRef = useRef(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const activePointer = useRef(null);

  const updateStick = (clientX, clientY) => {
    const rect = baseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let dx = clientX - centerX;
    let dy = clientY - centerY;
    const dist = Math.hypot(dx, dy);

    if (dist > MAX_RADIUS) {
      dx = (dx / dist) * MAX_RADIUS;
      dy = (dy / dist) * MAX_RADIUS;
    }

    setKnob({ x: dx, y: dy });
    joystickInput.x = dx / MAX_RADIUS;
    joystickInput.y = dy / MAX_RADIUS;
  };

  const handlePointerDown = (e) => {
    e.stopPropagation();
    activePointer.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateStick(e.clientX, e.clientY);
  };

  const handlePointerMove = (e) => {
    if (activePointer.current !== e.pointerId) return;
    updateStick(e.clientX, e.clientY);
  };

  const handlePointerUp = (e) => {
    if (activePointer.current !== e.pointerId) return;
    activePointer.current = null;
    setKnob({ x: 0, y: 0 });
    joystickInput.x = 0;
    joystickInput.y = 0;
  };

  return (
    <div
      ref={baseRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="pointer-events-auto fixed bottom-6 left-1/2 z-20 flex h-24 w-24 -translate-x-1/2 touch-none select-none items-center justify-center rounded-full border-2 border-[#080808] bg-white/85 shadow-[3px_3px_0px_#080808]"
    >
      <div
        style={{ transform: `translate(${knob.x}px, ${knob.y}px)` }}
        className="h-10 w-10 rounded-full border-2 border-[#080808] bg-[#FF5A1F] shadow-[2px_2px_0px_#080808]"
      />
    </div>
  );
}
