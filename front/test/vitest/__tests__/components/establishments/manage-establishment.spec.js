import { mount } from '@vue/test-utils'
import ManageEstablishment from 'src/components/establishments/ManageEstablishment.vue'
import { useEstablishmentsStore } from 'src/stores/establishments-store.js'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import EditButtons from 'src/components/buttons/EditButtons.vue'

describe('ManageEstablishment Component', () => {
  let wrapper
  let mockedEstablishment
  let pinia
  let establishmentsStoreMock

  beforeEach(() => {
    vi.clearAllMocks()

    pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: { usersStore: { users: [] } },
    })

    establishmentsStoreMock = useEstablishmentsStore()

    mockedEstablishment = {
      id: 'est-123',
      name: 'établissement',
      enterprise_id: 'ent-123'
    }

    wrapper = mount(ManageEstablishment, {
      props: { establishment: mockedEstablishment },
      global: {
        plugins: [pinia],
      },
    })
  })

  // GET
  it('displays the correct establishment data', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.establishmentName').text()).toContain(mockedEstablishment.name)
  })

  describe('EditButtons Actions', () => {
    // UPDATE
    it('should call updateEstablishment method when catch an emit "save"', async () => {
      establishmentsStoreMock.updateEstablishment = vi.fn()

      await wrapper.vm.$nextTick();
      await wrapper.findComponent(EditButtons).vm.$emit('save')
      expect(establishmentsStoreMock.updateEstablishment).toHaveBeenCalled();
    })

    // CANCEL
    it('should call reset and reset values when catch an emit "cancel"', async () => {
      // init
      wrapper.vm.editingEsta = true
      wrapper.vm.establishmentName = 'Nouvelle valeur'

      await wrapper.findComponent(EditButtons).vm.$emit('cancel')

      // check values after "cancel"
      expect(wrapper.vm.establishmentName).toBe(mockedEstablishment.name)
      expect(wrapper.find('.establishmentName').text()).toContain(mockedEstablishment.name)
      expect(wrapper.vm.editingEsta).toBe(false)
      expect(wrapper.find('.establishmentNameInput').exists()).toBe(false)
    })

    // EDIT
    it('should change editingEsta to true when catch an emit "edit"', async () => {
      wrapper.vm.editingEsta = false
      await wrapper.findComponent(EditButtons).vm.$emit('edit')
      expect(wrapper.vm.editingEsta).toBe(true)
      expect(wrapper.find('.establishmentNameInput').exists()).toBe(true)
    })

    // DELETE
    it('should call deleteEstablishment method when catch an emit "delete"', async () => {
      establishmentsStoreMock.deleteEstablishment = vi.fn()

      await wrapper.vm.$nextTick();
      await wrapper.findComponent(EditButtons).vm.$emit('delete')
      expect(establishmentsStoreMock.deleteEstablishment).toHaveBeenCalled();
    })

    it('should emit deleteEstablishment in case of positive response type', async () => {
      establishmentsStoreMock.deleteEstablishment = vi.fn().mockResolvedValue({ type: 'positive', message: 'Deleted successfully' });
      await wrapper.vm.$nextTick();
      await wrapper.findComponent(EditButtons).vm.$emit('delete')

      expect(wrapper.emitted('deleteEstablishment')).toBeTruthy();
    });
  })
})
