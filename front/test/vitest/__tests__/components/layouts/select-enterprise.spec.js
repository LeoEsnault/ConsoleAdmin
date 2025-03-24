import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import SelectEnterprise from '@/components/layouts/SelectEnterprise.vue'
import { useEnterpriseStore } from '@/stores/enterprise-store'
import { useUsersStore } from '@/stores/users-store'
import { getUserFromStorage } from '@/utils/getUserFromStorage'

vi.mock('@/utils/getUserFromStorage', () => ({
  getUserFromStorage: vi.fn(),
}))

describe('SelectEnterprise.vue', () => {
  let enterpriseStoreMock
  let usersStoreMock
  let wrapper
  let pinia

  beforeEach(() => {
    vi.clearAllMocks()

    pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: { usersStore: { users: [] } },
    })

    usersStoreMock = useUsersStore()
    enterpriseStoreMock = useEnterpriseStore()

    wrapper = mount(SelectEnterprise, {
      global: {
        plugins: [pinia],
      },
    })

    const mockUser = { id: 'user-123' }
    getUserFromStorage.mockReturnValue(mockUser)

    usersStoreMock.updateUser = vi.fn()
  })

  it('should fetch enterprises', async () => {
    expect(enterpriseStoreMock.getEnterprises).toHaveBeenCalled()
  })

  it('should display enterprises', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.availableEnterprises).toEqual(enterpriseStoreMock.enterprises)
  })

  it('should emit update when an enterprise is selected', async () => {
    const mockEnterprise = { id: 'ent-2', name: 'Entreprise B' }

    wrapper.vm.selectedEnterprise = mockEnterprise

    await wrapper.vm.updateUserEnterprise()

    expect(usersStoreMock.updateUser).toHaveBeenCalledWith('user-123', {
      profile: {
        enterprise_id: mockEnterprise.id,
      },
    })

    expect(wrapper.emitted('update')).toBeTruthy()
  })

  it('should handle errors when updating the enterprise', async () => {
    const mockEnterprise = { id: 'ent-2', name: 'Entreprise B' }
    const mockError = new Error('Erreur lors de la mise à jour')

    getUserFromStorage.mockReturnValue({ id: 'user-123' })

    usersStoreMock.updateUser.mockRejectedValue(mockError)

    wrapper.vm.selectedEnterprise = mockEnterprise

    await wrapper.vm.updateUserEnterprise()

    await wrapper.vm.$nextTick()

    expect(usersStoreMock.updateUser).toHaveBeenCalledWith('user-123', {
      profile: { enterprise_id: mockEnterprise.id },
    })
  })
})
