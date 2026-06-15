import { useEffect, useState } from 'react'

export const EYE_FRAMES = ['◉', '◎', '○', '◎'] as const

export function useEye(intervalMs = 600) {
  const [frame, setFrame] = useState(0)
  useEffect(() => {
    const t = setInterval(
      () => setFrame((f) => (f + 1) % EYE_FRAMES.length),
      intervalMs,
    )
    return () => clearInterval(t)
  }, [intervalMs])
  return EYE_FRAMES[frame]
}
