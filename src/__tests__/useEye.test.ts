import { expect, test } from 'bun:test'
import { EYE_FRAMES } from '../hooks/useEye'

test('EYE_FRAMES cycles through the correct glyphs', () => {
  expect(EYE_FRAMES).toEqual(['◉', '◎', '○', '◎'])
})

test('EYE_FRAMES has 4 frames', () => {
  expect(EYE_FRAMES.length).toBe(4)
})

test('EYE_FRAMES loop: frame N % 4 maps to correct glyph', () => {
  const frames = [...EYE_FRAMES]
  expect(frames[0]).toBe('◉')
  expect(frames[1]).toBe('◎')
  expect(frames[2]).toBe('○')
  expect(frames[3]).toBe('◎')
})
