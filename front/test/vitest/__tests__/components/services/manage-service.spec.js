import { mount } from '@vue/test-utils'
import ManageService from 'src/components/services/ManageService.vue'
import { useServicesStore } from 'src/stores/services-store.js'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import EditButtons from 'src/components/buttons/EditButtons.vue'

describe('ManageService Component', () => {
  let wrapper
  let mockedService
  let pinia
  let servicesStoreMock

  beforeEach(() => {
    vi.clearAllMocks()

    pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: { usersStore: { users: [] } },
    })

    servicesStoreMock = useServicesStore()

    mockedService = {
      id: 'ser-123',
      name: 'service',
      enterprise_id: 'ent-123'
    }

    wrapper = mount(ManageService, {
      props: { service: mockedService },
      global: {
        plugins: [pinia],
      },
    })
  })

  // GET
  it('displays the correct service data', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.serviceName').text()).toContain(mockedService.name)
  })

  describe('EditButtons Actions', () => {
    // UPDATE
    it('should call updateService method when catch an emit "save"', async () => {
      servicesStoreMock.updateService = vi.fn()

      await wrapper.vm.$nextTick();
      await wrapper.findComponent(EditButtons).vm.$emit('save')
      expect(servicesStoreMock.updateService).toHaveBeenCalled();
    })

    // CANCEL
    it('should call reset and reset values when catch an emit "cancel"', async () => {
      // init
      wrapper.vm.editing = true
      wrapper.vm.serviceName = 'Nouvelle valeur'

      await wrapper.findComponent(EditButtons).vm.$emit('cancel')

      // check values after "cancel"
      expect(wrapper.vm.serviceName).toBe(mockedService.name)
      expect(wrapper.find('.serviceName').text()).toContain(mockedService.name)
      expect(wrapper.vm.editing).toBe(false)
      expect(wrapper.find('.serviceNameInput').exists()).toBe(false)
    })

    // EDIT
    it('should change editing to true when catch an emit "edit"', async () => {
      wrapper.vm.editing = false
      await wrapper.findComponent(EditButtons).vm.$emit('edit')
      expect(wrapper.vm.editing).toBe(true)
      expect(wrapper.find('.serviceNameInput').exists()).toBe(true)
    })

    // DELETE
    it('should call deleteService method when catch an emit "delete"', async () => {
      servicesStoreMock.deleteService = vi.fn()

      await wrapper.vm.$nextTick();
      await wrapper.findComponent(EditButtons).vm.$emit('delete')
      expect(servicesStoreMock.deleteService).toHaveBeenCalled();
    })

    it('should emit deleteService in case of positive response type', async () => {
      servicesStoreMock.deleteService = vi.fn().mockResolvedValue({ type: 'positive', message: 'Deleted successfully' });
      await wrapper.vm.$nextTick();
      await wrapper.findComponent(EditButtons).vm.$emit('delete')

      expect(wrapper.emitted('deleteService')).toBeTruthy();
    });
  })
})
