import { useAvatarStore } from '../../store/useAvatarStore'

export function InteractionPrompt() {
  const nearbyProp = useAvatarStore((s) => s.nearbyProp)
  const activeProp = useAvatarStore((s) => s.activeProp)
  const setActiveProp = useAvatarStore((s) => s.setActiveProp)

  return (
    <>
      {/* Bottom-Right Thumb Action Button (shows when near a prop) */}
      {nearbyProp && !activeProp && (
        <button
          onClick={() => setActiveProp(nearbyProp)}
          className="pointer-events-auto fixed right-5 bottom-20 z-20 border-2 border-[#080808] bg-[#FFE600] px-4 py-3 text-xs font-black uppercase text-[#080808] shadow-[4px_4px_0px_#080808] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
          {nearbyProp.actionLabel}
        </button>
      )}

      {/* Detail Modal (opens when user taps the button) */}
      {activeProp && (
        <div className="pointer-events-auto fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xs border-2 border-[#080808] bg-white p-5 shadow-[6px_6px_0px_#080808]">
            <div className="mb-2 flex items-start justify-between gap-2">
              <h2 className="text-base font-black uppercase text-[#080808]">
                {activeProp.title}
              </h2>
              <button
                onClick={() => setActiveProp(null)}
                className="border-2 border-[#080808] bg-[#FF5A1F] px-2 py-0.5 text-xs font-black text-white"
              >
                X
              </button>
            </div>

            <p className="mb-4 text-sm font-medium text-neutral-700">
              {activeProp.description}
            </p>

            <button
              onClick={() => setActiveProp(null)}
              className="w-full border-2 border-[#080808] bg-[#17233F] py-2 text-xs font-black uppercase text-white shadow-[3px_3px_0px_#080808] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  )
}