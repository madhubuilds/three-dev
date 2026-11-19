import { useState, useRef } from 'react'
import { useAvatarStore } from '../../store/useAvatarStore'

export function ChatBar() {
  const [input, setInput] = useState('')
  const setChatMessage = useAvatarStore((s) => s.setChatMessage)
  const timerRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim()) return

    setChatMessage(input.trim())
    setInput('')

    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setChatMessage(''), 4000)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="pointer-events-auto fixed bottom-4 left-1/2 z-20 flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 gap-2"
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Say something..."
        className="flex-1 border-2 border-[#080808] bg-white px-3 py-2 text-sm font-bold text-[#080808] shadow-[3px_3px_0px_#080808] outline-none placeholder:text-neutral-400"
      />
      <button
        type="submit"
        className="border-2 border-[#080808] bg-[#FF5A1F] px-4 py-2 text-sm font-black uppercase text-white shadow-[3px_3px_0px_#080808] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
      >
        Send
      </button>
    </form>
  )
}