import { Text } from 'ink'
import { useEffect, useState } from 'react'
import { theme } from '../../styles/theme'

interface Props {
  lastUpdated: Date | null
}

export function StatusBar({ lastUpdated }: Props) {
  const [, tick] = useState(0)
  useEffect(() => {
    const t = setInterval(() => tick((n) => n + 1), 1000)
    return () => clearInterval(t)
  }, [])

  if (!lastUpdated) return <Text color={theme.dim}>syncing…</Text>

  const secs = Math.floor((Date.now() - lastUpdated.getTime()) / 1000)
  const stale = secs > 30
  return <Text color={stale ? theme.warn : theme.dim}>updated {secs}s ago</Text>
}
