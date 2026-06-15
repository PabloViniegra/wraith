import { Text } from 'ink'
import { useEye } from '../../hooks/useEye'
import { theme } from '../../styles/theme'

export function EyeGlyph() {
  const glyph = useEye()
  return <Text color={theme.accent}>{glyph}</Text>
}
