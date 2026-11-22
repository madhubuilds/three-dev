import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Sparkles, Home, Users } from "lucide-react";

const ROUTE_META = {
  "/": { label: "Entering Profile Room...", icon: Home },
  "/plaza": { label: "Stepping into Town Plaza...", icon: Users },
  "/avatar": { label: "Opening Avatar Studio...", icon: Sparkles },
  "/builder": { label: "Opening 3D Workbench...", icon: Sparkles },
};

export function SceneTransition() {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    setVisible(true);
    setFading(false);

    // Hold briefly so WebGL Canvas & ContactShadows finish first frame
    const fadeTimer = setTimeout(() => setFading(true), 420);
    const hideTimer = setTimeout(() => setVisible(false), 780);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [pathname]);

  if (!visible) return null;

  const current = ROUTE_META[pathname] || ROUTE_META["/"];
  const Icon = current.icon;

  return (
    <div
      className={`pointer-events-auto fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F6EDE3]/90 backdrop-blur-xl transition-opacity duration-300 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-3 rounded-3xl border border-white/80 bg-white/85 px-7 py-6 shadow-[0_16px_40px_rgba(23,35,63,0.14)]">
        <div className="flex h-12 w-12 animate-bounce items-center justify-center rounded-2xl bg-[#FF5A1F] text-white shadow-md">
          <Icon size={22} />
        </div>
        <p className="text-xs font-bold tracking-tight text-[#17233F]">
          {current.label}
        </p>
        <div className="h-1.5 w-32 overflow-hidden rounded-full bg-[#17233F]/10">
          <div className="h-full w-full origin-left animate-[pulse_0.6s_ease-in-out_infinite] rounded-full bg-[#FF5A1F]" />
        </div>
      </div>
    </div>
  );
}