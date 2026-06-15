import { Box, Text } from 'ink'
import type { SysStats } from '../lib/system'
import { theme } from '../theme'

const BANNER = [
  '\u2588\u2588\u2557    \u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2557  \u2588\u2588\u2557',
  '\u2588\u2588\u2551    \u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2551\u2554\u2550\u2550\u2588\u2588\u2554\u2550\u2550\u2518\u2588\u2588\u2551  \u2588\u2588\u2551',
  '\u2588\u2588\u2551 \u2588\u2557 \u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u2518\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551\u2588\u2588\u2551   \u2588\u2588\u2551   \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551',
  '\u2588\u2588\u2551\u2588\u2588\u2588\u2557\u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2551\u2588\u2588\u2551   \u2588\u2588\u2551   \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2551',
  '\u255a\u2588\u2588\u2588\u2554\u2588\u2588\u2588\u2554\u255d\u2588\u2588\u2551  \u2588\u2588\u2551\u2588\u2588\u2551  \u2588\u2588\u2551\u2588\u2588\u2551   \u2588\u2588\u2551   \u2588\u2588\u2551  \u2588\u2588\u2551',
  ' \u255a\u2550\u2550\u255d\u255a\u2550\u2550\u255d \u255a\u2550\u255d  \u255a\u2550\u255d\u255a\u2550\u255d  \u255a\u2550\u255d\u255a\u2550\u255d   \u255a\u2550\u255d   \u255a\u2550\u255d  \u255a\u2550\u255d',
]

function bar(pct: number, width = 16) {
  const clamped = Math.min(100, Math.max(0, pct))
  const filled = Math.round((clamped / 100) * width)
  return '\u2588'.repeat(filled) + '\u2591'.repeat(width - filled)
}

interface Props {
  sys: SysStats | null
  procCount: number
  svcCount: number
  mock: boolean
}

export function Header({ sys, procCount, svcCount, mock }: Props) {
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
        {BANNER.map((line) => (
          <Text key={line} color={theme.fg}>
            {line}
          </Text>
        ))}
      </Box>

      <Box flexDirection='column' alignItems='flex-end'>
        <Text color={theme.accent} bold>
          win-task-manager{mock ? ' [MOCK]' : ''}
        </Text>
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
