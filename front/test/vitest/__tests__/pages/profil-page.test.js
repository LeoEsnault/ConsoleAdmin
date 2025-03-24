import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import ProfilPage from 'src/pages/ProfilePage.vue';
import { useProfilStore } from 'src/stores/profil-store';

vi.mock('src/stores/profil-store', () => ({
  useProfilStore: vi.fn().mockReturnValue({
    fetchUserProfil: vi.fn().mockResolvedValue({
    mail: 'john.doe@example.com', telephone: '0123456789', firstname: 'John', lastname: 'Doe'
    }),
    updateProfil: vi.fn().mockResolvedValue({ error: null }),
  }),
}));


describe('ProfilPage.vue', () => {
  let wrapper;
  let profilStore;
  let router;

  beforeEach(async () => {
    profilStore = useProfilStore();

    wrapper = mount(ProfilPage);

    await wrapper.vm.$nextTick();
  });

  it('Verifie la presence du formulaire', async () => {
    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.find('#inputProfile1').exists()).toBe(true);
    expect(wrapper.find('#inputProfile0').exists()).toBe(true);
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="phone"]').exists()).toBe(true);
    expect(wrapper.find('button').exists()).toBe(true);

  })
  it('Verifie la presence du lien pour updatePassword', async () => {
    expect(wrapper.find('.mdpForget').exists()).toBe(true);
  })

  it('Montre bien les données dans le formulaire', async () => {
    expect(profilStore.fetchUserProfil).toHaveBeenCalled();

   
    expect(wrapper.vm.firstName).toBe('John');
    expect(wrapper.vm.lastName).toBe('Doe');
    expect(wrapper.vm.email).toBe('john.doe@example.com');
    expect(wrapper.vm.phone).toBe('0123456789');
  });
});
