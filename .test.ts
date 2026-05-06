import { describe, it, expect } from 'vitest'

// pure helper: validate password length
export function isPasswordValid(password: unknown): boolean {
	if (password === null || password === undefined) return false
	if (typeof password !== 'string') return false
	if (password.length === 0) throw new Error('empty password')
	return password.length >= 6
}

describe('Password validation', () => {
	it('normal case: password with at least 6 chars is valid', () => {
		expect(isPasswordValid('secret1')).toBe(true)
		expect(isPasswordValid('123456')).toBe(true)
	})

	it('edge case: password with <=5 chars is invalid', () => {
		expect(isPasswordValid('12345')).toBe(false)
		expect(isPasswordValid('a')).toBe(false)
	})

	it('error case: empty input throws', () => {
		expect(() => isPasswordValid('')).toThrow('empty password')
		expect(isPasswordValid(null)).toBe(false)
	})
})
