import { mount } from '@vue/test-utils'
import AddButton from 'src/components/buttons/AddButton.vue'
import { describe, it, expect } from 'vitest'

describe('AddButton', () => {
  it('emits click event on button click', async () => {
    const wrapper = mount(AddButton, {
      props: {
        text: 'Click me!',
        disable: false,
      },
    })

    await wrapper.findComponent({ name: 'q-btn' }).trigger('click')

    expect(wrapper.emitted().click).toBeTruthy()
  })
})
