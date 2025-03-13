import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getUserFromStorage } from '@/utils/getUserFromStorage'

describe('getUserFromStorage', () => {

  // mock localStorage
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    })
  })

  it('should return user from localStorage when data is correct', () => {
    const mockUser = { id: 'user-123', name: 'John Doe' }
    const authData = JSON.stringify({ user: mockUser })
    localStorage.getItem.mockReturnValue(authData)

    const result = getUserFromStorage()

    expect(result).toEqual(mockUser)
  })

  it('should return null when there is no data in localStorage', () => {
    localStorage.getItem.mockReturnValue(null)

    const result = getUserFromStorage()

    expect(result).toBeNull()
  })

  it('should return null if there is an error while parsing the data', () => {
    localStorage.getItem.mockReturnValue('{invalidJson}')

    const result = getUserFromStorage()

    expect(result).toBeNull()
  })
})
