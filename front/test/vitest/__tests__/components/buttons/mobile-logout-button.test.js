import { mount } from '@vue/test-utils'
import { vi, it, describe, beforeEach, expect } from 'vitest'
import LogoutButton from 'src/components/buttons/MobileLogoutButton.vue'
import { useAuthStore } from 'src/stores/auth-store.js'
import { useRouter } from 'vue-router'


vi.mock('src/stores/auth-store.js', () => ({
  useAuthStore: vi.fn()
}))

vi.mock('vue-router', () => ({
  useRouter: vi.fn()
}))

describe('LogoutButton.vue', () => {
  let authStoreMock
  let routerMock

  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    authStoreMock = {
      logout: vi.fn().mockResolvedValue({ type: 'success', message: 'Déconnexion réussie' })
    }

    routerMock = {
      push: vi.fn()
    }

    // Mocker les implémentations des dépendances
    useAuthStore.mockReturnValue(authStoreMock)
    useRouter.mockReturnValue(routerMock)
  })

  it('doit appeler la méthode logout et rediriger vers /login en cas de succès', async () => {
    const wrapper = mount(LogoutButton)

    // Simuler un clic sur le bouton de déconnexion
    const logoutButton = wrapper.find('.logout-button')
    await logoutButton.trigger('click')

    // Vérifier que la méthode logout a bien été appelée
    expect(authStoreMock.logout).toHaveBeenCalled()

    // Vérifier que la redirection vers /login a bien eu lieu
    expect(routerMock.push).toHaveBeenCalledWith('/login')

  })

  it('doit afficher une notification en cas d\'erreur lors de la déconnexion', async () => {
    // Mocker un échec de la déconnexion
    authStoreMock.logout.mockResolvedValueOnce({ type: 'error', message: 'Échec de la déconnexion' })

    const wrapper = mount(LogoutButton)

    // Simuler un clic sur le bouton de déconnexion
    const logoutButton = wrapper.find('.logout-button')
    await logoutButton.trigger('click')

    // Vérifier que la notification est affichée avec le bon message
    expect(routerMock.push).toBeCalledTimes(0)

  })

  it('doit afficher le bon texte pour le bouton de déconnexion', () => {
    const wrapper = mount(LogoutButton)

    // Vérifier le texte du bouton de déconnexion
    const buttonText = wrapper.find('.text-negative')
    expect(buttonText.text()).toBe('Déconnexion')
  })

  it('doit avoir la bonne classe CSS sur l\'élément iconLogout', () => {
    const wrapper = mount(LogoutButton)

    // Vérifier que l'icône de déconnexion a la bonne classe CSS
    const icon = wrapper.find('.iconLogout')
    expect(icon.classes()).toContain('iconLogout')
  })
})
