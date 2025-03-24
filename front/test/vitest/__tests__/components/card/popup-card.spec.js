import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PopUpCard from '@/components/card/PopUpCard.vue'

describe('PopUpCard.vue', () => {
  let wrapper

  beforeEach(() => {
    vi.clearAllMocks()

    wrapper = mount(PopUpCard, {
      props: {
        title: 'Titre du test',
        text: 'Ceci est un test',
        popUp: true,
        loading: false,
      },
    })
  })

  it('display title and text', async () => {
    expect(wrapper.find('#popup-title').text()).toContain('Titre du test')
    expect(wrapper.find('#popup-text').text()).toContain('Ceci est un test')
  })

  it('emits event "confirm" on click on "Valider"', async () => {
    const confirmBtn = wrapper.find('.confirm-btn')
    await confirmBtn.trigger('click')

    expect(wrapper.emitted('confirm')).toBeTruthy()
    expect(wrapper.emitted('confirm').length).toBe(1)
  })

  it('emits event "update:popUp" on click on "Annuler"', async () => {
    const cancelBtn = wrapper.find('.cancel-btn')
    await cancelBtn.trigger('click')

    expect(wrapper.emitted('update:popUp')).toBeTruthy()
    expect(wrapper.emitted('update:popUp')[0]).toEqual([false])
  })
})
