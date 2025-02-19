import { mount } from '@vue/test-utils'
import ManageUser from 'src/components/users/manage-user.vue'
import { describe, it, expect } from 'vitest'

describe('ManageUser Component', () => {
  it('displays the correct user data', async () => {
    const mockedUser = {
      id: 1,
      email: 'test@example.com',
      profile: {
        firstname: 'John',
        lastname: 'Doe',
      },
    }

    const wrapper = mount(ManageUser, {
      props: { user: mockedUser },
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.find('#userEmail').text()).toContain(mockedUser.email)
    expect(wrapper.find('#userFirstname').text()).toContain(mockedUser.profile.firstname)
    expect(wrapper.find('#userLastname').text()).toContain(mockedUser.profile.lastname)
  })
})
