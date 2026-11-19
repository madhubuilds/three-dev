import { WorldCanvas } from '../scene/WorldCanvas'
import { HUD } from '../ui/HUD'

export function WorldPage() {
  return (
    <main className="relative h-[100dvh] w-screen overflow-hidden"> 
      <WorldCanvas />
      <HUD />
    </main>
  )
}