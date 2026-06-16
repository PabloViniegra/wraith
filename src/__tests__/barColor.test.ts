import { expect, test } from 'bun:test'
import { theme } from '../styles/theme'
import { barColor } from '../ui/components/Header'

test('barColor returns bright (acid green) below 50%', () => {
  expect(barColor(0)).toBe(theme.bright)
  expect(barColor(49)).toBe(theme.bright)
})

test('barColor returns warn (amber) at 50–79%', () => {
  expect(barColor(50)).toBe(theme.warn)
  expect(barColor(79)).toBe(theme.warn)
})

test('barColor returns accent (magenta) at 80%+', () => {
  expect(barColor(80)).toBe(theme.accent)
  expect(barColor(100)).toBe(theme.accent)
})
