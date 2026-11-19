import { AvatarStudioCanvas } from '../scene/AvatarStudioCanvas'
import { AvatarCustomizerPanel } from '../ui/avatar/AvatarCustomizerPanel'

export function AvatarStudioPage() {
  return (
    <main className="flex h-[100dvh] w-screen flex-col overflow-hidden md:flex-row">
      <section className="h-1/2 w-full md:h-full md:flex-1">
        <AvatarStudioCanvas />
      </section>
      <section className="h-1/2 w-full md:h-full md:w-96">
        <AvatarCustomizerPanel />
      </section>
    </main>
  )
}