import { describe, it, expect } from 'vitest'

// pure helper: validate email format
export function isEmailValid(email: unknown): boolean {
  if (email === null || email === undefined) return false
  if (typeof email !== 'string') return false
  if (email.length === 0) throw new Error('empty email')
  // simple RFC-like check (not exhaustive)
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

describe('Email validation', () => {
  it('normal case: valid email returns true', () => {
    expect(isEmailValid('user@example.com')).toBe(true)
    expect(isEmailValid('first.last+tag@sub.domain.co')).toBe(true)
  })

  it('empty input: empty string throws, null/undefined return false', () => {
    expect(() => isEmailValid('')).toThrow('empty email')
    expect(isEmailValid(null)).toBe(false)
    expect(isEmailValid(undefined)).toBe(false)
  })

  it('invalid type: non-string returns false', () => {
    // numbers, objects, arrays should return false
  expect(isEmailValid(12345)).toBe(false)
  expect(isEmailValid({})).toBe(false)
  })
})
