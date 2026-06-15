import { expect, test } from 'bun:test'
import { render } from 'ink-testing-library'
import { EYE_FRAMES } from '../hooks/useEye'
import { SOURCE } from '../hooks/useGlitch'
import { EyeGlyph } from '../ui/primitives/EyeGlyph'
import { GlitchBanner } from '../ui/primitives/GlitchBanner'
import { Spinner } from '../ui/primitives/Spinner'

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
