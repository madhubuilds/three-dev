import { useState } from "react";
import { X } from "lucide-react";
import { DevBuilderCanvas } from "../scene/DevBuilderCanvas";
import {
  DevAnimationBar,
  DevInspectorPanel,
  DevOutlinerPanel,
  DevTopBar,
} from "../ui/dev/DevBuilderHUD";
import { useDevBuilderStore } from "../store/useDevBuilderStore";

export function DevBuilderPage() {
  const [mobileDrawer, setMobileDrawer] = useState(null); // "outliner" | "inspector" | null
  const theme = useDevBuilderStore((s) => s.theme);
  const isDark = theme === "dark";

  return (
    <main
      className={`flex h-[100dvh] w-full flex-col overflow-hidden transition-colors ${
        isDark ? "bg-[#0B0F19]" : "bg-[#F3ECE4]"
      }`}
    >
      {/* Top Toolbar */}
      <DevTopBar
        mobileDrawer={mobileDrawer}
        setMobileDrawer={setMobileDrawer}
      />

      {/* 3-Column Studio Body */}
      <div className="relative flex min-h-0 flex-1">
        {/* LEFT COLUMN (Desktop): Scene Folders & Shapes */}
        <div className="hidden w-60 shrink-0 md:block">
          <DevOutlinerPanel />
        </div>

        {/* CENTER COLUMN: 3D Viewport + Live Animation Preview Bar */}
        <div className="relative min-w-0 flex-1">
          <DevBuilderCanvas />
          <DevAnimationBar />
        </div>

        {/* RIGHT COLUMN (Desktop): Transform All Sides + Big 24-Color Palette */}
        <div className="hidden w-80 shrink-0 md:block">
          <DevInspectorPanel />
        </div>

        {/* MOBILE DRAWERS (Phones / Narrow Viewports) */}
        {mobileDrawer && (
          <div
            className={`fixed inset-x-0 bottom-0 z-40 flex max-h-[68dvh] flex-col rounded-t-3xl border-t shadow-2xl md:hidden ${
              isDark
                ? "border-white/15 bg-[#111726] text-slate-100"
                : "border-[#17233F]/15 bg-white text-[#17233F]"
            }`}
          >
            <div
              className={`flex items-center justify-between border-b px-4 py-2.5 ${
                isDark ? "border-white/10" : "border-[#17233F]/10"
              }`}
            >
              <span className="text-xs font-extrabold uppercase tracking-wider">
                {mobileDrawer === "outliner"
                  ? "Shapes & Folders"
                  : "Transform & Gradient Palette"}
              </span>
              <button
                onClick={() => setMobileDrawer(null)}
                className={`flex h-7 w-7 items-center justify-center rounded-full ${
                  isDark
                    ? "bg-white/10 text-slate-200"
                    : "bg-[#17233F]/8 text-[#17233F]"
                }`}
              >
                <X size={15} />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              {mobileDrawer === "outliner" ? (
                <DevOutlinerPanel onCloseMobile={() => setMobileDrawer(null)} />
              ) : (
                <DevInspectorPanel />
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}