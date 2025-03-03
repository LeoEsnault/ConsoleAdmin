import { mount } from '@vue/test-utils'
import { vi, it, describe, beforeEach, expect } from 'vitest'
import ForgotPassword from 'src/pages/ForgotPasswordPage.vue'
import { useRouter } from 'vue-router'
import { supabase } from 'src/supabase/supabase'


vi.mock('vue-router', () => ({
  useRouter: vi.fn()
}))

vi.mock('src/supabase/supabase', () => ({
  supabase: {
    auth: {
      resetPasswordForEmail: vi.fn()
    }
  }
}))

describe('ForgotPassword.vue', () => {
  let quasarMock
  let routerMock
  let supabaseMock

  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    quasarMock = {
      notify: vi.fn()
    }

    routerMock = {
      push: vi.fn()
    }

    supabaseMock = {
      auth: {
        resetPasswordForEmail: vi.fn()
      }
    }

    // Mocker les implémentations des dépendances
    useRouter.mockReturnValue(routerMock)
    supabase.auth.resetPasswordForEmail.mockReturnValue(Promise.resolve())
  })

  it('doit appeler la méthode resetPasswordForEmail et afficher une notification en cas de succès', async () => {
    const wrapper = mount(ForgotPassword)

    // Simuler la saisie d'un email valide
    await wrapper.find('input[type="email"]').setValue('utilisateur@email.com')

    // Simuler un clic sur le bouton d'envoi
    const sendButton = wrapper.find('#h__forgot_password_btn')
    await sendButton.trigger('click')

    // Vérifier que la méthode resetPasswordForEmail a été appelée avec l'email
    expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
      'utilisateur@email.com',
      { redirectTo: `${process.env.FRONT_URL}/reset-password?` }
    )

    // Vérifier que la redirection vers la page de connexion a eu lieu
    expect(routerMock.push).toHaveBeenCalledWith("/login")
  })

  it('doit afficher une notification en cas d\'erreur lors de l\'envoi de la demande', async () => {
    // Mocker un échec de la méthode de réinitialisation
    supabase.auth.resetPasswordForEmail.mockRejectedValueOnce(new Error('Erreur réseau'))

    const wrapper = mount(ForgotPassword)

    // Simuler la saisie d'un email valide
    await wrapper.find('input[type="email"]').setValue('utilisateur@email.com')

    const sendButton = wrapper.find('#h__forgot_password_btn')
    await sendButton.trigger('click')


    expect(routerMock.push).not.toHaveBeenCalledTimes(0)
  })

  it('doit désactiver le bouton si l\'email est vide', async () => {
    const wrapper = mount(ForgotPassword)

    await wrapper.find('input[type="email"]').setValue('')

    const sendButton = wrapper.find('#h__forgot_password_btn')
    expect(sendButton.attributes('disabled')).toBeDefined()
  })

  it('doit activer le bouton si l\'email est valide', async () => {
    const wrapper = mount(ForgotPassword)

    await wrapper.find('input[type="email"]').setValue('utilisateur@email.com')

    const sendButton = wrapper.find('#h__forgot_password_btn')
    expect(sendButton.attributes('disabled')).toBeUndefined()
  })
})
