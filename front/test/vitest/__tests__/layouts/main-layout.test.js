import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import MainLayout from 'src/layouts/MainLayout.vue'
import { useProfilStore } from 'src/stores/profil-store.js'
import { createRouter, createWebHistory } from 'vue-router'

vi.mock('@supabase/supabase-js', () => {
  return {
    createClient: vi.fn().mockReturnValue({
      auth: {
        signIn: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
        getUser: vi.fn(),
      },
      from: vi.fn(),
    }),
  }
})

describe('MainLayout', () => {
  let profilStoreMock
  let wrapper
  let pinia
  let router


  beforeEach(async () => {
    vi.clearAllMocks()

    router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/', name: 'home' }],
    })

    pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: { profilStore: { user: [] } },
    })

    profilStoreMock = useProfilStore()
    profilStoreMock.getUserFromStorage = vi.fn()

    wrapper = mount(MainLayout, {
      global: {
        plugins: [pinia, router],
      },
    })

    await router.isReady()
  })

  it('should call indent reloadKey which reload children component automatically', async () => {
    const enterpriseChange = wrapper.findComponent({ name: 'SelectEnterprise' })
    expect(enterpriseChange.exists()).toBe(true)

    await enterpriseChange.vm.$emit('update')
    await flushPromises()

    expect(wrapper.vm.reloadKey).toBeGreaterThan(0)
  })
})
