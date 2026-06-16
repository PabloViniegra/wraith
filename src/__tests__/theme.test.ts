import { expect, test } from 'bun:test'
import { theme } from '../styles/theme'

const HEX = /^#[0-9a-fA-F]{6}$/

const REQUIRED_KEYS = [
  'fg',
  'accent',
  'bright',
  'dim',
  'warn',
  'danger',
  'selectionBg',
  'selectionFg',
  'border',
  'borderSecondary',
] as const

test('theme has all required Neo-Tokyo color keys', () => {
  for (const key of REQUIRED_KEYS) {
    expect(theme).toHaveProperty(key)
  }
})

test('all theme values are valid hex strings', () => {
  for (const [key, value] of Object.entries(theme)) {
    expect(
      HEX.test(value),
      `theme.${key} = "${value}" is not a valid hex color`,
    ).toBe(true)
  }
})

test('theme.fg is Neo-Tokyo cyan', () => {
  expect(theme.fg).toBe('#00f5ff')
})

test('theme.accent is hot magenta', () => {
  expect(theme.accent).toBe('#ff006e')
})

test('theme.bright is acid green', () => {
  expect(theme.bright).toBe('#39ff14')
})

test('theme.selectionBg equals theme.accent', () => {
  expect(theme.selectionBg).toBe(theme.accent)
})
