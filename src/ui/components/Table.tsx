import { Box, Text } from 'ink'
import { theme } from '../../styles/theme'

export interface Column<T> {
  key: string
  header: string
  width: number
  align?: 'left' | 'right'
  value: (row: T) => string
  color?: (row: T) => string | undefined
}

function pad(text: string, width: number, align: 'left' | 'right' = 'left') {
  let s = text
  if (s.length > width) s = `${s.slice(0, Math.max(0, width - 1))}…`
  return align === 'right' ? s.padStart(width) : s.padEnd(width)
}

interface Props<T> {
  columns: Column<T>[]
  rows: T[]
  selected: number
  visible: number
}

export function Table<T>({ columns, rows, selected, visible }: Props<T>) {
  const half = Math.floor(visible / 2)
  let start = Math.max(0, selected - half)
  start = Math.min(start, Math.max(0, rows.length - visible))
  const slice = rows.slice(start, start + visible)

  return (
    <Box flexDirection='column'>
      <Box>
        <Text> </Text>
        {columns.map((c, ci) => (
          <Text key={c.key} color={theme.accent} bold underline>
            {pad(c.header, c.width, c.align)}
            {ci < columns.length - 1 ? ' ' : ''}
          </Text>
        ))}
      </Box>

      {slice.map((row, i) => {
        const idx = start + i
        const isSelected = idx === selected

        if (isSelected) {
          const line = columns
            .map((c) => pad(c.value(row), c.width, c.align))
            .join(' ')
          return (
            <Text
              key={idx}
              backgroundColor={theme.selectionBg}
              color={theme.selectionFg}
              bold
            >
              {`▐${line} `}
            </Text>
          )
        }

        return (
          <Box key={idx}>
            <Text color={theme.dim}> </Text>
            {columns.map((c, ci) => (
              <Text key={c.key} color={c.color?.(row) ?? theme.fg}>
                {pad(c.value(row), c.width, c.align)}
                {ci < columns.length - 1 ? ' ' : ''}
              </Text>
            ))}
          </Box>
        )
      })}

      {rows.length === 0 && <Text color={theme.dim}> (sin resultados)</Text>}
    </Box>
  )
}
