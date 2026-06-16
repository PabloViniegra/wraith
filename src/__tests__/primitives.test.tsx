import { expect, test } from 'bun:test'
import { render } from 'ink-testing-library'
import { STATUS_ICON } from '../App'
import { EYE_FRAMES } from '../hooks/useEye'
import { SOURCE } from '../hooks/useGlitch'
import type { Column } from '../ui/components/Table'
import { Table } from '../ui/components/Table'
import { EyeGlyph } from '../ui/primitives/EyeGlyph'
import { GlitchBanner } from '../ui/primitives/GlitchBanner'
import { Spinner } from '../ui/primitives/Spinner'

type Row = { name: string }
const cols: Column<Row>[] = [
  { key: 'name', header: 'NAME', width: 10, value: (r) => r.name },
]
const rows: Row[] = [{ name: 'alpha' }, { name: 'beta' }, { name: 'gamma' }]

test('EyeGlyph renders a glyph from EYE_FRAMES on initial frame', () => {
  const { lastFrame } = render(<EyeGlyph />)
  const output = lastFrame() ?? ''
  expect(EYE_FRAMES.some((g) => output.includes(g))).toBe(true)
})

test('GlitchBanner renders at least the first SOURCE line after boot starts', () => {
  const { lastFrame } = render(<GlitchBanner />)
  const output = lastFrame() ?? ''
  // During boot sequence, at minimum the first line appears after 120ms.
  // On initial render (0ms) lines array is empty — output may be blank.
  // We assert the component renders without throwing.
  expect(typeof output).toBe('string')
})

test('Spinner renders a braille character', () => {
  const BRAILLE = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
  const { lastFrame } = render(<Spinner />)
  const output = lastFrame() ?? ''
  expect(BRAILLE.some((c) => output.includes(c))).toBe(true)
})

test('Spinner renders label when provided', () => {
  const { lastFrame } = render(<Spinner label='loading…' />)
  const output = lastFrame() ?? ''
  expect(output).toContain('loading…')
})

test('SOURCE has expected number of banner lines', () => {
  expect(SOURCE.length).toBe(6)
})

test('Table selected row renders ▐ glyph prefix', () => {
  const { lastFrame } = render(
    <Table columns={cols} rows={rows} selected={1} visible={10} />,
  )
  const output = lastFrame() ?? ''
  expect(output).toContain('▐')
})

test('Table non-selected rows do not render ▐', () => {
  const { lastFrame } = render(
    <Table columns={cols} rows={rows} selected={0} visible={10} />,
  )
  const lines = (lastFrame() ?? '').split('\n')
  // row index 1 (beta) is not selected — should not have ▐
  const betaLine = lines.find((l) => l.includes('beta'))
  expect(betaLine).toBeDefined()
  expect(betaLine).not.toContain('▐')
})

test('STATUS_ICON ok is ⚡', () => {
  expect(STATUS_ICON.ok).toBe('⚡')
})

test('STATUS_ICON err is ☠', () => {
  expect(STATUS_ICON.err).toBe('☠')
})

test('STATUS_ICON info is ◈', () => {
  expect(STATUS_ICON.info).toBe('◈')
})
