import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import EstablishmentsPage from 'src/pages//admin/EstablishmentsPage.vue'
import { useEstablishmentsStore } from 'src/stores/establishments-store.js'
import { useEnterpriseStore } from 'src/stores/enterprise-store.js'

describe('EstablishmentsPage.vue', () => {
  let establishmentsStoreMock
  let enterpriseStoreMock
  let wrapper
  let pinia

  beforeEach(() => {
    vi.clearAllMocks()

    pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: { establishmentsStore: { establishment: [] } },
    })

    establishmentsStoreMock = useEstablishmentsStore()
    enterpriseStoreMock = useEnterpriseStore()

    // initialise EnterpriseData.value.establishments
    vi.spyOn(enterpriseStoreMock, 'getEnterprise').mockResolvedValue({ establishments: [] })

    wrapper = mount(EstablishmentsPage, {
      global: {
        plugins: [pinia],
      },
    })
  })

  const data = { name: 'établissement' }

  it('fetches establishment from store', async () => {
    expect(enterpriseStoreMock.getEnterprise).toHaveBeenCalled()
  })

  it('should call addEstablishment in store', async () => {
    await establishmentsStoreMock.addEstablishment(data)
    expect(establishmentsStoreMock.addEstablishment).toHaveBeenCalledWith(data)
  })

  it('should push Establishment in EnterpriseData after adding', async () => {
    const newEstablishment = { id: 'est-123', name: 'hello', enterprise_id: "ent-123" }

    // Mock méthode addEstablishment
    vi.spyOn(establishmentsStoreMock, 'addEstablishment').mockResolvedValue({ data: newEstablishment })

    // init enterpriseData
    expect(wrapper.vm.enterpriseData.establishments).toBeDefined()
    expect(wrapper.vm.enterpriseData.establishments).toHaveLength(0) // Au début, la liste est vide

    // Simuler ajout établissement
    await wrapper.vm.addEstablishment('hello', () => { })
    await wrapper.vm.$nextTick()

    // Check établissement ajouté
    expect(establishmentsStoreMock.addEstablishment).toHaveBeenCalledWith({ name: 'hello' })
    expect(wrapper.vm.enterpriseData.establishments).toContainEqual(newEstablishment)
  })

  it('should handle error when adding establishment fails', async () => {
    establishmentsStoreMock.addEstablishment = vi.fn().mockRejectedValue(new Error('Failed to add establishment'))
    await expect(wrapper.vm.addEstablishment(data)).rejects.toThrow('Failed to add establishment')
  })

  it('should call fetchEnterprise when deleteEstablishment is emitted', async () => {
    wrapper.vm.fetchEnterprise = vi.fn();

    // Forcer enterpriseData à contenir un établissement
    wrapper.vm.enterpriseData = {
      establishments: [{ id: 'est-123', name: 'Test Establishment' }]
    };
    await wrapper.vm.$nextTick();

    const manageEstablishment = wrapper.findComponent({ name: 'ManageEstablishment' });
    expect(manageEstablishment.exists()).toBe(true);

    manageEstablishment.vm.$emit('deleteEstablishment');
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.fetchEnterprise).toHaveBeenCalled();
  });
})
