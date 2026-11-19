import { PlazaCanvas } from "../scene/PlazaCanvas";
import { HUD } from "../ui/HUD";

export function PlazaPage() {
  return (
    <main className="relative h-[100dvh] w-screen overflow-hidden">
      <PlazaCanvas />
      <HUD />
    </main>
  );
}