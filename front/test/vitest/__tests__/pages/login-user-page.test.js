import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import LoginPage from '@/pages/LoginUserPage.vue'
import { useAuthStore } from 'src/stores/auth-store.js'
import { useEnterpriseStore } from 'src/stores/enterprise-store.js'
import { createTestingPinia } from '@pinia/testing'

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signInWithEmail: vi.fn().mockResolvedValue({
        user: { id: 1 },
        error: null
      }),
      signUp: vi.fn().mockResolvedValue({
        user: { id: 2 },
        error: null
      })
    },
    from: vi.fn(() => ({
      select: vi.fn().mockResolvedValue({ data: [], error: null })
    }))
  }))
}))

const pushMock = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock
  })
}))

describe('LoginPage', () => {
  let wrapper
  let authStore
  let enterpriseStore

  beforeEach(() => {
    const pinia = createTestingPinia()

    authStore = useAuthStore(pinia)
    authStore.login.mockResolvedValue({ type: 'success', message: 'authentification réussie', data: { id: 1 } })
    authStore.fetchUserRole.mockResolvedValue({
      type: 'success',
      message: 'authentification réussie',
      data: { role_name: 'SuperAdmin' }
    })

    enterpriseStore = useEnterpriseStore(pinia)

    // Montage du composant avec Pinia mocké
    wrapper = mount(LoginPage, {
      global: {
        plugins: [pinia]
      }
    })
  })

  it('devrait afficher le formulaire de connexion', () => {
    // Vérifie que les éléments sont présents
    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.find('input[type="email"]').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
  })

  it('devrait appeler la méthode handleLogin lors de la soumission du formulaire', async () => {
    const emailInput = wrapper.find('input[type="email"]')
    const passwordInput = wrapper.find('input[type="password"]')

    // Remplir les champs du formulaire
    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('password123')

    // Soumettre le formulaire
    const btn = await wrapper.find('#h__login_btn')
    await btn.trigger('click')

    // Vérifier que la méthode login est appelée avec les bonnes valeurs
    expect(authStore.login).toHaveBeenCalledWith('test@example.com', 'password123')

    // Vérifier que la méthode fetchUserRole est appelée avec un ID utilisateur
    expect(authStore.fetchUserRole).toHaveBeenCalled(1)

    // Vérifier que la méthode fetchUserRole est appelée avec un ID utilisateur
    expect(enterpriseStore.getEnterprise).toHaveBeenCalled(1)
  })
})
