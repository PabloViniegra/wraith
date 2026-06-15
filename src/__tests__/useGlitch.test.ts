import { expect, test } from 'bun:test'
import { SOURCE } from '../hooks/useGlitch'

test('SOURCE has 6 banner lines', () => {
  expect(SOURCE.length).toBe(6)
})

test('all SOURCE lines are non-empty strings', () => {
  for (const line of SOURCE) {
    expect(typeof line).toBe('string')
    expect(line.length).toBeGreaterThan(0)
  }
})

test('all SOURCE lines have the same length (banner is rectangular)', () => {
  const lengths = SOURCE.map((l) => [...l].length)
  const max = Math.max(...lengths)
  const min = Math.min(...lengths)
  // allow ±1 for trailing space on first/last rows
  expect(max - min).toBeLessThanOrEqual(1)
})
