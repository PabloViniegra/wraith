import { Box, Text } from 'ink'
import type { SysStats } from '../../lib/system'
import { theme } from '../../styles/theme'
import { EyeGlyph } from '../primitives/EyeGlyph'
import { GlitchBanner } from '../primitives/GlitchBanner'
import { StatusBar } from '../primitives/StatusBar'

function bar(pct: number, width = 16) {
  const clamped = Math.min(100, Math.max(0, pct))
  const filled = Math.round((clamped / 100) * width)
  return '█'.repeat(filled) + '░'.repeat(width - filled)
}

interface Props {
  sys: SysStats | null
  procCount: number
  svcCount: number
  mock: boolean
  lastUpdated: Date | null
}

export function Header({ sys, procCount, svcCount, mock, lastUpdated }: Props) {
  const cpu = sys?.CpuPct ?? 0
  const memPct = sys?.MemTotalMB
    ? Math.round((sys.MemUsedMB / sys.MemTotalMB) * 100)
    : 0

  return (
    <Box
      borderStyle='round'
      borderColor={theme.border}
      paddingX={1}
      justifyContent='space-between'
    >
      <Box flexDirection='column'>
        <Box>
          <EyeGlyph />
          <Text color={theme.dim}> </Text>
          <Text color={theme.accent} bold>
            {mock ? 'WRAITH [MOCK]' : 'WRAITH'}
          </Text>
        </Box>
        <GlitchBanner />
      </Box>

      <Box flexDirection='column' alignItems='flex-end'>
        <StatusBar lastUpdated={lastUpdated} />
        <Text color={theme.dim}>{new Date().toLocaleTimeString()}</Text>
        <Text> </Text>
        <Text color={theme.fg}>
          CPU [
          <Text color={cpu > 80 ? theme.danger : theme.bright}>{bar(cpu)}</Text>
          ] {String(cpu).padStart(3)}%
        </Text>
        <Text color={theme.fg}>
          MEM [
          <Text color={memPct > 80 ? theme.danger : theme.bright}>
            {bar(memPct)}
          </Text>
          ] {String(memPct).padStart(3)}%
        </Text>
        <Text color={theme.dim}>
          procs:{procCount} svcs:{svcCount}
        </Text>
      </Box>
    </Box>
  )
}
