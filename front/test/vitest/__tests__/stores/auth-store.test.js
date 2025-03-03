import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAuthStore } from 'src/stores/auth-store.js'
import { supabase } from 'src/supabase/supabase'

vi.mock('src/supabase/supabase', () => ({
  supabase: {
    auth: {
      setSession: vi.fn(),
      signOut: vi.fn(),
      signInWithPassword: vi.fn(),
      updateUser: vi.fn(),
      getSession: vi.fn(),
    },
  },
}))

const pushMock = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}))

describe('Auth Store - checkSessionAndRedirect', () => {
  beforeEach(() => {
    setActivePinia(createPinia()) // Active Pinia pour chaque test
    pushMock.mockClear() // Réinitialise le mock du router avant chaque test
  })

  it('ne redirige pas si aucune session n\'est trouvée', async () => {
    supabase.auth.getSession.mockResolvedValueOnce({ data: { session: null }, error: null })

    const authStore = useAuthStore()
    await authStore.checkSessionAndRedirect()

    expect(pushMock).not.toHaveBeenCalled()
  })

  it('redirige vers "/" si une session est trouvée', async () => {
    supabase.auth.getSession.mockResolvedValueOnce({
      data: { session: { user: { id: '123' } } },
      error: null,
    })

    const authStore = useAuthStore()
    await authStore.checkSessionAndRedirect()

    expect(pushMock).toHaveBeenCalledWith('/')
  })

  it('gère les erreurs de récupération de session', async () => {
    supabase.auth.getSession.mockResolvedValueOnce({ data: null, error: new Error('Test error') })

    const authStore = useAuthStore()
    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {})

    await authStore.checkSessionAndRedirect()

    expect(consoleErrorMock).toHaveBeenCalledWith(
      'Erreur lors de la récupération de la session :',
      'Test error'
    )

    consoleErrorMock.mockRestore()
  })
})

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with default state', () => {
    const store = useAuthStore()
    expect(store.user).toBe(null)
    expect(store.loading).toBe(false)
    expect(store.messageClass).toBe('')
  })

  it('should handle token correctly', async () => {
    global.window = Object.create(window)
    Object.defineProperty(window, 'location', {
      value: {
        search: '?access_token=testAccessToken&refresh_token=testRefreshToken',
        hash: '',
      },
    })

    const store = useAuthStore()
    await store.handleToken()
    expect(supabase.auth.setSession).toHaveBeenCalledWith({
      access_token: 'testAccessToken',
      refresh_token: 'testRefreshToken',
    })
  })

  it('should fetch user role correctly', async () => {
    supabase.from = vi.fn(() => ({
      select: vi.fn(() => ({ eq: vi.fn(() => ({ single: vi.fn(() => ({ data: { role: 'super_admin' }, error: null })) })) })),
    }))

    const store = useAuthStore()
    const response = await store.fetchUserRole('1234')
    expect(response).toEqual({
      type: 'success',
      message: 'Autorisation effectuée avec succès.',
      data: 'super_admin',
    })
  })

  it('should return error if user role is not SuperAdmin', async () => {
    supabase.from = vi.fn(() => ({
      select: vi.fn(() => ({ eq: vi.fn(() => ({ single: vi.fn(() => ({ data: { role: 'User' }, error: null })) })) })),
    }))

    const store = useAuthStore()
    const response = await store.fetchUserRole('1234')
    expect(response).toEqual({
      type: 'error',
      message: "Vous n'avez pas les droits nécessaires pour vous connecter à l'application",
    })
  })

  it('should login successfully', async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: { id: '123' }, session: {} },
      error: null,
    })

    const store = useAuthStore()
    const response = await store.login('test@example.com', 'password123')

    expect(response.type).toBe('success')
    expect(response.message).toBe('Authentification réussie')
    expect(store.user).toEqual({ id: '123' })
  })

  it('should handle login failure', async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: null,
      error: { message: 'Login failed' },
    })

    const store = useAuthStore()
    const response = await store.login('test@example.com', 'wrongpassword')

    expect(response.type).toBe('error')
    expect(response.message).toBe(
      'Impossible de vous identifier, veuillez vérifier votre e-mail et votre mot de passe.'
    )
    expect(store.user).toBe(null)
  })

  it('should logout successfully', async () => {
    supabase.auth.signOut.mockResolvedValue({ error: null })
    const store = useAuthStore()
    store.user = { id: '123' }

    await store.logout()

    expect(store.user).toBe(null)
  })

  it('should update password successfully', async () => {
    supabase.auth.updateUser.mockResolvedValue({ error: null })
    const store = useAuthStore()

    const response = await store.updatePassword('newPassword123')
    expect(response.type).toBe('success')
    expect(response.message).toBe('Mot de passe mis à jour avec succés.')
  })

  it('should handle password update failure', async () => {
    supabase.auth.updateUser.mockResolvedValue({ error: { message: 'Update failed' } })
    const store = useAuthStore()

    const response = await store.updatePassword('newPassword123')
    expect(response.type).toBe('error')
    expect(response.message).toBe('Impossible de mettre à jour votre mot de passe.')
  })
})
