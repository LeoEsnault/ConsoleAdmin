import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import HomeButton from 'src/components/buttons/HomeButton.vue';
import { createRouter, createWebHistory } from 'vue-router';


const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: {} }],
});

describe('HomeButton.vue', () => {
  it('doit s\'afficher correctement', () => {
    const wrapper = mount(HomeButton, {
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it('doit contenir un lien vers "/"', () => {
    const wrapper = mount(HomeButton, {
      global: {
        plugins: [router],
      },
    });

    const link = wrapper.find('a');
    expect(link.exists()).toBe(true);
    expect(link.attributes('href')).toBe('/'); 
  });
});
