import { mount } from '@vue/test-utils'
import EditButtons from 'src/components/buttons/EditButtons.vue'
import { describe, it, expect } from 'vitest'

describe('EditButtons', () => {
  it('emits "save" on save button', async () => {
    const wrapper = mount(EditButtons, {
      props: {
        isEditing: true,
        isUpdated: true,
      },
    })

    await wrapper.find('#save').trigger('click')
    expect(wrapper.emitted('save')).toBeTruthy()
  })

  it('emits "cancel" on cancel button', async () => {
    const wrapper = mount(EditButtons, {
      props: {
        isEditing: true,
      },
    })

    await wrapper.find('#cancel').trigger('click')
    expect(wrapper.emitted('cancel')).toBeTruthy()
  })

  it('emits "edit" on edit button', async () => {
    const wrapper = mount(EditButtons, {
      props: {
        isEditing: false,
      },
    })

    await wrapper.find('#edit').trigger('click')
    expect(wrapper.emitted('edit')).toBeTruthy()
  })

  it('emits "delele" on delele button', async () => {
    const wrapper = mount(EditButtons, {
      props: {
        isEditing: false,
      },
    })

    await wrapper.find('#delete').trigger('click')
    expect(wrapper.emitted('delete')).toBeTruthy()
  })

  it('show "save" and "cancel" in isEditing mode', () => {
    const wrapper = mount(EditButtons, {
      props: {
        isEditing: true,
      },
    })

    expect(wrapper.find('#save').exists()).toBe(true)
    expect(wrapper.find('#cancel').exists()).toBe(true)
    expect(wrapper.find('#edit').exists()).toBe(false)
    expect(wrapper.find('#delete').exists()).toBe(false)
  })

  it('show "edit" and "delete" in normal mode', () => {
    const wrapper = mount(EditButtons, {
      props: {
        isEditing: false,
      },
    })

    expect(wrapper.find('#save').exists()).toBe(false)
    expect(wrapper.find('#cancel').exists()).toBe(false)
    expect(wrapper.find('#edit').exists()).toBe(true)
    expect(wrapper.find('#delete').exists()).toBe(true)
  })

  it('inactive "save" button when isUpdated is false', () => {
    const wrapper = mount(EditButtons, {
      props: {
        isEditing: true,
        isUpdated: false,
      },
    })

    expect(wrapper.find('#save').attributes('disabled')).toBeDefined()
  })

  it('active "save" button when isUpdated is true', () => {
    const wrapper = mount(EditButtons, {
      props: {
        isEditing: true,
        isUpdated: true,
      },
    })

    expect(wrapper.find('#save').attributes('disabled')).toBeUndefined()
  })


})
