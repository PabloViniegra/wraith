import { useEffect, useRef, useState } from 'react'

export const SOURCE = [
  '██╗    ██╗██████╗  █████╗ ██╗████████╗██╗  ██╗',
  '██║    ██║██╔══██╗██╔══██╗██║╚══██╔══╝██║  ██║',
  '██║ █╗ ██║██████╔╝███████║██║   ██║   ███████║',
  '██║███╗██║██╔══██╗██╔══██║██║   ██║   ██╔══██║',
  '╚███╔███╔╝██║  ██║██║  ██║██║   ██║   ██║  ██║',
  ' ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝   ╚═╝   ╚═╝  ╚═╝',
]

const NOISE = '!@#$%^&*<>?/\\|~`'

function glitch(line: string): string {
  const chars = line.split('')
  const count = Math.max(1, Math.floor(chars.length * 0.08))
  for (let i = 0; i < count; i++) {
    const pos = Math.floor(Math.random() * chars.length)
    chars[pos] = NOISE[Math.floor(Math.random() * NOISE.length)] ?? '?'
  }
  return chars.join('')
}

export function useGlitch() {
  const [revealed, setRevealed] = useState(0)
  const [lines, setLines] = useState<string[]>([])
  const booted = revealed >= SOURCE.length
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  // Boot sequence: reveal one line per 120ms
  useEffect(() => {
    if (booted) return
    const t = setTimeout(() => {
      const next = revealed + 1
      setRevealed(next)
      setLines(SOURCE.slice(0, next))
    }, 120)
    return () => clearTimeout(t)
  }, [revealed, booted])

  // Glitch pulse: after boot, glitch briefly every 4-6s (recursive timeout)
  useEffect(() => {
    if (!booted) return
    let t1: ReturnType<typeof setTimeout>
    let t2: ReturnType<typeof setTimeout>

    const schedule = () => {
      const delay = 4000 + Math.random() * 2000
      t1 = setTimeout(() => {
        if (!mountedRef.current) return
        setLines(SOURCE.map(glitch))
        t2 = setTimeout(() => {
          if (!mountedRef.current) return
          setLines([...SOURCE])
          schedule()
        }, 120)
      }, delay)
    }

    schedule()
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [booted])

  return booted ? (lines.length ? lines : SOURCE) : lines
}
