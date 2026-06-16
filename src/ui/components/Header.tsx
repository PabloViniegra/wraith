import { Box, Text } from 'ink'
import type { SysStats } from '../../lib/system'
import { theme } from '../../styles/theme'
import { EyeGlyph } from '../primitives/EyeGlyph'
import { GlitchBanner } from '../primitives/GlitchBanner'
import { StatusBar } from '../primitives/StatusBar'

export function barColor(pct: number): string {
  if (pct >= 80) return theme.accent
  if (pct >= 50) return theme.warn
  return theme.bright
}

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
          <Text> </Text>
          <Text color={theme.selectionFg} backgroundColor={theme.fg} bold>
            {mock ? ' WRAITH [MOCK] ' : ' WRAITH '}
          </Text>
        </Box>
        <GlitchBanner />
      </Box>

      <Box flexDirection='column' alignItems='flex-end'>
        <StatusBar lastUpdated={lastUpdated} />
        <Text color={theme.dim}>{new Date().toLocaleTimeString()}</Text>
        <Text> </Text>
        <Text color={theme.fg}>
          {'CPU ['}
          <Text color={barColor(cpu)}>{bar(cpu)}</Text>
          {`] ${String(cpu).padStart(3)}%`}
        </Text>
        <Text color={theme.fg}>
          {'MEM ['}
          <Text color={barColor(memPct)}>{bar(memPct)}</Text>
          {`] ${String(memPct).padStart(3)}%`}
        </Text>
        <Text color={theme.dim}>
          procs:{procCount} ◆ svcs:{svcCount}
        </Text>
      </Box>
    </Box>
  )
}
