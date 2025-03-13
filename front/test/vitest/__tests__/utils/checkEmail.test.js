import { describe, it, expect, vi, beforeEach } from 'vitest'
import { isValidEmail, checkEmail } from '@/utils/checkEmail'

describe('isValidEmail', () => {
  it('should return true for a valid email', () => {
    const validEmail = 'test@example.com'
    expect(isValidEmail(validEmail)).toBe(true)
  })

  it('should return false for an invalid email', () => {
    const invalidEmail = 'test@com'
    expect(isValidEmail(invalidEmail)).toBe(false)
  })

  it('should return false for an email without "@"', () => {
    const invalidEmail = 'testexample.com'
    expect(isValidEmail(invalidEmail)).toBe(false)
  })

  it('should return false for an email with spaces', () => {
    const invalidEmail = 'test @example.com'
    expect(isValidEmail(invalidEmail)).toBe(false)
  })
})

describe('checkEmail', () => {
  let quasarMock

  beforeEach(() => {
    quasarMock = {
      notify: vi.fn(),
    }
  })

  it('should return true for a valid email', () => {
    const validEmail = 'test@example.com'
    const result = checkEmail(validEmail, quasarMock)

    expect(result).toBe(true)
  })

  it('should return false for an invalid email', () => {
    const invalidEmail = 'test@com'
    const result = checkEmail(invalidEmail, quasarMock)

    expect(result).toBe(false)

  })

  it('should trim spaces from email before validation', () => {
    const emailWithSpaces = '  test@example.com  '
    const result = checkEmail(emailWithSpaces, quasarMock)

    expect(result).toBe(true)

  })

  it('should trim spaces from email before validation', () => {
    const emailWithSpaces = '  test@example.com  '
    const result = checkEmail(emailWithSpaces, quasarMock)

    expect(result).toBe(true)
  })
})


