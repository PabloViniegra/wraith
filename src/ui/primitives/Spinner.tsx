import { Text } from 'ink'
import { useEffect, useState } from 'react'
import { theme } from '../../styles/theme'

const FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']

interface Props {
  label?: string
}

export function Spinner({ label }: Props) {
  const [frame, setFrame] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setFrame((f) => (f + 1) % FRAMES.length), 80)
    return () => clearInterval(t)
  }, [])
  return (
    <Text color={theme.dim}>
      <Text color={theme.accent}>{FRAMES[frame]}</Text>
      {label ? ` ${label}` : ''}
    </Text>
  )
}
