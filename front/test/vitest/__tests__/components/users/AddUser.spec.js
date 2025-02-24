import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AddUser from 'src/components/users/AddUser.vue'
import AddButton from 'src/components/buttons/AddButton.vue'

describe('AddUser', () => {
  it('disables AddButton when userEmail is empty', async () => {
    const wrapper = mount(AddUser)

    const button = wrapper.findComponent(AddButton)

    expect(button.props().disable).toBe(true)

    wrapper.vm.userEmail = 'test@example.com'
    await wrapper.vm.$nextTick()

    expect(button.props().disable).toBe(false)
  })

  it('emits a "click" and resets userEmail after successful addition', async () => {
    const wrapper = mount(AddUser)

    // Simule data & clic
    wrapper.vm.userEmail = 'test@example.com'
    await wrapper.vm.$nextTick()

    await wrapper.findComponent(AddButton).trigger('click')

    // émission clic
    const emitted = wrapper.emitted('click')
    expect(emitted).toBeTruthy()
    expect(emitted[0]).toEqual(['test@example.com', expect.any(Function)])

    // simule resolve
    const resolve = emitted[0][1]
    expect(typeof resolve).toBe('function')
    resolve(true)

    await wrapper.vm.$nextTick()
    expect(wrapper.vm.userEmail).toBe('')
  })

  it('emits a "click" and does not reset userEmail after failed addition', async () => {
    const wrapper = mount(AddUser)

    wrapper.vm.userEmail = 'test@example.com'
    await wrapper.vm.$nextTick()

    await wrapper.findComponent(AddButton).trigger('click')

    const emitted = wrapper.emitted('click')
    expect(emitted).toBeTruthy()
    expect(emitted[0]).toEqual(['test@example.com', expect.any(Function)])

    const resolve = emitted[0][1]
    expect(typeof resolve).toBe('function')

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    resolve(false)

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.userEmail).toBe('test@example.com')

    expect(consoleSpy).toHaveBeenCalledWith("Erreur lors de l'ajout de l'utilisateur.")

    consoleSpy.mockRestore()
  })
})
