import { Link, useLocation } from "react-router-dom";
import { Home, Users, Sparkles } from "lucide-react";
import { useAvatarStore } from "../../store/useAvatarStore";

const NAV_ITEMS = [
  { to: "/", label: "Room", icon: Home },
  { to: "/plaza", label: "Plaza", icon: Users },
  { to: "/avatar", label: "Avatar", icon: Sparkles },
];

export function BottomNav() {
  const { pathname } = useLocation();
  const { setIsDecorating, setNearbyProp, setActiveProp } = useAvatarStore();

  const handleNavigate = () => {
    setIsDecorating(false);
    setNearbyProp(null);
    setActiveProp(null);
  };

  return (
    <nav className="pointer-events-auto fixed bottom-4 left-1/2 z-20 -translate-x-1/2">
      <div className="flex items-center gap-1 rounded-full border border-white/60 bg-white/80 p-1.5 shadow-[0_10px_30px_rgba(23,35,63,0.16)] backdrop-blur-md">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
          const isActive = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              onClick={handleNavigate}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                isActive
                  ? "bg-[#17233F] text-white shadow-sm"
                  : "text-[#17233F]/70 hover:bg-black/5 hover:text-[#17233F]"
              }`}
            >
              <Icon size={15} strokeWidth={2.3} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}