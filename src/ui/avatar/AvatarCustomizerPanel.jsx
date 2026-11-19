import { useNavigate } from 'react-router-dom'
import { useAvatarStore } from '../../store/useAvatarStore'

const ANIMATIONS = ['idle', 'walk', 'wave']
const PARTS = [
  { key: 'skin', label: 'Skin' },
  { key: 'hair', label: 'Hair' },
  { key: 'shirt', label: 'Shirt' },
  { key: 'pants', label: 'Pants' },
]

export function AvatarCustomizerPanel() {
  const navigate = useNavigate()
  const { username, setUsername, animation, setAnimation, colors, setColor } =
    useAvatarStore()

  return (
    <div className="flex h-full flex-col justify-between overflow-y-auto border-t-3 border-[#080808] bg-white p-5 md:border-t-0 md:border-l-3">
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-black uppercase tracking-tight text-[#080808]">
            Avatar Studio
          </h1>
          <p className="text-xs font-bold text-neutral-500">
            Drag character to rotate 360°
          </p>
        </div>

        {/* Username Input */}
        <div>
          <label className="mb-1.5 block text-xs font-black uppercase">
            Username
          </label>
          <input
            type="text"
            maxLength={16}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="your_name"
            className="w-full border-2 border-[#080808] px-3 py-2 text-sm font-bold shadow-[3px_3px_0px_#080808] outline-none"
          />
        </div>

        {/* Pose Preview */}
        <div>
          <p className="mb-1.5 text-xs font-black uppercase">Preview Pose</p>
          <div className="flex gap-2">
            {ANIMATIONS.map((anim) => (
              <button
                key={anim}
                onClick={() => setAnimation(anim)}
                className={`flex-1 border-2 border-[#080808] py-2 text-xs font-black uppercase transition-colors ${
                  animation === anim
                    ? 'bg-[#FF5A1F] text-white shadow-[2px_2px_0px_#080808]'
                    : 'bg-white text-[#080808]'
                }`}
              >
                {anim}
              </button>
            ))}
          </div>
        </div>

        {/* Colour Pickers */}
        <div>
          <p className="mb-2 text-xs font-black uppercase">Outfit Colors</p>
          <div className="grid grid-cols-2 gap-3">
            {PARTS.map(({ key, label }) => (
              <label
                key={key}
                className="flex cursor-pointer items-center justify-between border-2 border-[#080808] bg-[#f4f4f0] px-3 py-2 text-xs font-black uppercase"
              >
                {label}
                <input
                  type="color"
                  value={colors[key]}
                  onChange={(e) => setColor(key, e.target.value)}
                  className="h-6 w-8 cursor-pointer border-2 border-[#080808] p-0"
                />
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Save & Enter World */}
      <button
        onClick={() => navigate('/')}
        className="mt-6 w-full border-2 border-[#080808] bg-[#17233F] py-3 text-sm font-black uppercase text-white shadow-[4px_4px_0px_#080808] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
      >
        Save & Enter World
      </button>
    </div>
  )
}