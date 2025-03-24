import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AddItemInput from 'src/components/card/AddItemInput.vue'
import AddButton from 'src/components/buttons/AddButton.vue'

describe('AddItemInput', () => {
  it('disables AddButton when itemValue is empty', async () => {
    const wrapper = mount(AddItemInput)

    const button = wrapper.findComponent(AddButton)

    expect(button.props().disable).toBe(true)

    wrapper.vm.itemValue = 'hello'
    await wrapper.vm.$nextTick()

    expect(button.props().disable).toBe(false)
  })

  it('emits a "click" and resets itemValue after successful addition', async () => {
    const wrapper = mount(AddItemInput)

    // Simule data & clic
    wrapper.vm.itemValue = 'hello'
    await wrapper.vm.$nextTick()

    await wrapper.findComponent(AddButton).trigger('click')

    // émission clic
    const emitted = wrapper.emitted('click')
    expect(emitted).toBeTruthy()
    expect(emitted[0]).toEqual(['hello', expect.any(Function)])

    // simule resolve
    const resolve = emitted[0][1]
    expect(typeof resolve).toBe('function')
    resolve(true)

    await wrapper.vm.$nextTick()
    expect(wrapper.vm.itemValue).toBe('')
  })

  it('emits a "click" and does not reset itemValue after failed addition', async () => {
    const wrapper = mount(AddItemInput)

    wrapper.vm.itemValue = 'hello'
    await wrapper.vm.$nextTick()

    await wrapper.findComponent(AddButton).trigger('click')

    const emitted = wrapper.emitted('click')
    expect(emitted).toBeTruthy()
    expect(emitted[0]).toEqual(['hello', expect.any(Function)])

    const resolve = emitted[0][1]
    expect(typeof resolve).toBe('function')

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

    resolve(false)

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.itemValue).toBe('hello')

    expect(consoleSpy).toHaveBeenCalledWith("Erreur lors de l'ajout.")

    consoleSpy.mockRestore()
  })
})
