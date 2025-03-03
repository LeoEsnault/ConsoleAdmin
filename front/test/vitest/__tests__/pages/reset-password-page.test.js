import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import UpdatePasswordPage from 'src/pages/ResetPasswordPage.vue'
import { useAuthStore } from 'src/stores/auth-store.js'
import { createTestingPinia } from '@pinia/testing'
import { useRouter } from 'vue-router'

const pushMock = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock
  })
}))

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

describe('UpdatePasswordPage', () => {
  let wrapper
  let authStore
  let router

  beforeEach(() => {
    const pinia = createTestingPinia()

    authStore = useAuthStore(pinia)
    authStore.updatePassword.mockResolvedValue({ type: 'success', message: 'modification réussie' })

    router = useRouter()

    wrapper = mount(UpdatePasswordPage, {
      global: {
        plugins: [pinia]
      }
    })
  })

  it('devrait afficher le formulaire de mise à jour du mot de passe', () => {
    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
  })

  it('devrait mettre à jour le mot de passe avec succès', async () => {
    const newPasswordInput = wrapper.find('input[type="password"]')
    await newPasswordInput.setValue('newpassword123')

    const confirmPasswordInput = wrapper.find('#secondInputPassword input')
    await confirmPasswordInput.setValue('newpassword123')

    const submitButton = wrapper.find('#h__update_password_btn')
    await submitButton.trigger('click')

    expect(authStore.updatePassword).toHaveBeenCalledWith('newpassword123')
    expect(router.push).toHaveBeenCalledWith('/login')
  })

  it('devrait afficher une erreur si les mots de passe ne correspondent pas', async () => {
    const newPasswordInput = wrapper.find('input[type="password"]')
    await newPasswordInput.setValue('newpassword123')

    const confirmPasswordInput = wrapper.find('#secondInputPassword input')
    await confirmPasswordInput.setValue('differentpassword')

    const submitButton = wrapper.find('#h__update_password_btn')
    await submitButton.trigger('click')

    expect(authStore.updatePassword).toBeCalledTimes(0)
  })
})
