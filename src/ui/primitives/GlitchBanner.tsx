import { Text } from 'ink'
import { useGlitch } from '../../hooks/useGlitch'
import { theme } from '../../styles/theme'

export function GlitchBanner() {
  const lines = useGlitch()
  return (
    <>
      {lines.map((line, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: banner rows are fixed-position; content changes on glitch so position is the only stable key
        <Text key={i} color={theme.fg}>
          {line}
        </Text>
      ))}
    </>
  )
}
