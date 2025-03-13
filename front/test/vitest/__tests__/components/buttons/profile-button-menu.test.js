import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProfileButtonMenu from 'src/components/buttons/ProfileButtonMenu.vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth-store';


vi.mock('vue-router', () => ({
  useRouter: vi.fn(),
}));

vi.mock('src/stores/auth-store', () => ({
  useAuthStore: vi.fn(),
}));


describe('ProfileButton.vue', () => {
  let authStoreMock;
  let routerMock;
  let $qMock;

  beforeEach(() => {
    authStoreMock = {
      logout: vi.fn().mockResolvedValue({ type: 'success', message: 'Déconnexion réussie' }),
    };

    routerMock = {
      push: vi.fn(),
    };

    useAuthStore.mockReturnValue(authStoreMock);
    useRouter.mockReturnValue(routerMock);
  });

  it('doit appeler la méthode logout et rediriger vers /login en cas de succès', async () => {
    const wrapper = mount(ProfileButtonMenu);

    const logoutButton = wrapper.find('#logout-button');
    await logoutButton.trigger('click');

    expect(authStoreMock.logout).toHaveBeenCalled();


    expect(routerMock.push).toHaveBeenCalledWith('/login');
  });

  it('doit afficher le texte correct pour le bouton de déconnexion', () => {
    const wrapper = mount(ProfileButtonMenu);
    const buttonText = wrapper.find('#logout-button');
    expect(buttonText.text()).toContain('Déconnexion');
  });
});
