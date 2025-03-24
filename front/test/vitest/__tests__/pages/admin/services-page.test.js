import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import ServicesPage from 'src/pages//admin/ServicesPage.vue'
import { useServicesStore } from 'src/stores/services-store.js'
import { useEnterpriseStore } from 'src/stores/enterprise-store.js'

describe('ServicesPage.vue', () => {
  let servicesStoreMock
  let enterpriseStoreMock
  let wrapper
  let pinia

  beforeEach(() => {
    vi.clearAllMocks()

    pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: { servicesStore: { service: [] } },
    })

    servicesStoreMock = useServicesStore()
    enterpriseStoreMock = useEnterpriseStore()

    // initialise EnterpriseData.value.services
    vi.spyOn(enterpriseStoreMock, 'getEnterprise').mockResolvedValue({ services: [] })

    wrapper = mount(ServicesPage, {
      global: {
        plugins: [pinia],
      },
    })
  })

  const data = { name: 'service' }

  it('fetches service from store', async () => {
    expect(enterpriseStoreMock.getEnterprise).toHaveBeenCalled()
  })

  it('should call addService in store', async () => {
    await servicesStoreMock.addService(data)
    expect(servicesStoreMock.addService).toHaveBeenCalledWith(data)
  })

  it('should push Service in EnterpriseData after adding', async () => {
    const newService = { id: 'ser-123', name: 'hello', enterprise_id: "ent-123" }

    // Mock méthode addService
    vi.spyOn(servicesStoreMock, 'addService').mockResolvedValue({ data: newService })

    // init enterpriseData
    expect(wrapper.vm.enterpriseData.services).toBeDefined()
    expect(wrapper.vm.enterpriseData.services).toHaveLength(0) // Au début, la liste est vide

    // Simuler ajout service
    await wrapper.vm.addService('hello', () => { })
    await wrapper.vm.$nextTick()

    // Check service ajouté
    expect(servicesStoreMock.addService).toHaveBeenCalledWith({ name: 'hello' })
    expect(wrapper.vm.enterpriseData.services).toContainEqual(newService)
  })

  it('should handle error when adding service fails', async () => {
    servicesStoreMock.addService = vi.fn().mockRejectedValue(new Error('Failed to add service'))
    await expect(wrapper.vm.addService(data)).rejects.toThrow('Failed to add service')
  })

  it('should call fetchEnterprise when deleteService is emitted', async () => {
    wrapper.vm.fetchEnterprise = vi.fn();

    // Forcer enterpriseData à contenir un service
    wrapper.vm.enterpriseData = {
      services: [{ id: 'ser-123', name: 'Test Service' }]
    };
    await wrapper.vm.$nextTick();

    const manageService = wrapper.findComponent({ name: 'ManageService' });
    expect(manageService.exists()).toBe(true);

    manageService.vm.$emit('deleteService');
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.fetchEnterprise).toHaveBeenCalled();
  });
})
