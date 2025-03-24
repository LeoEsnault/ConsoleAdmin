import { mount } from '@vue/test-utils'
import ManageUser from 'src/components/users/ManageUser.vue'
import { useUsersStore } from 'src/stores/users-store.js'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import PopUpCard from 'src/components/card/PopUpCard.vue'
import EditButtons from 'src/components/buttons/EditButtons.vue'

describe('ManageUser Component', () => {
  let wrapper
  let mockedUser
  let pinia
  let usersStoreMock

  beforeEach(() => {
    vi.clearAllMocks()

    pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: { usersStore: { users: [] } },
    })

    usersStoreMock = useUsersStore()

    mockedUser = {
      id: 1,
      email: 'test@example.com',
      profile: {
        firstname: 'John',
        lastname: 'Doe',
      },
    }

    wrapper = mount(ManageUser, {
      props: { user: mockedUser },
      global: {
        plugins: [pinia],
      },
      //components: { PopUpCard },
    })
  })

  // GET
  it('displays the correct user data', async () => {
    await wrapper.vm.$nextTick()

    expect(wrapper.find('#userEmail').text()).toContain(mockedUser.email)
    expect(wrapper.find('#userFirstname').text()).toContain(mockedUser.profile.firstname)
    expect(wrapper.find('#userLastname').text()).toContain(mockedUser.profile.lastname)
  })

  // PUT
  it('displays input fields when clicking on edit button - DESKTOP', async () => {
    expect(wrapper.vm.isEditingUser).toBe(false)

    // display
    expect(wrapper.find('#userEmail').exists()).toBe(true)
    expect(wrapper.find('#userLastname').exists()).toBe(true)
    expect(wrapper.find('#userFirstname').exists()).toBe(true)
    expect(wrapper.find('#userEmailInput').exists()).toBe(false)
    expect(wrapper.find('#userLastnameInput').exists()).toBe(false)
    expect(wrapper.find('#userFirstnameInput').exists()).toBe(false)

    // clic on button
    await wrapper.findComponent(EditButtons).vm.$emit('edit')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isEditingUser).toBe(true)

    // display
    expect(wrapper.find('#userEmail').exists()).toBe(false)
    expect(wrapper.find('#userLastname').exists()).toBe(false)
    expect(wrapper.find('#userFirstname').exists()).toBe(false)
    expect(wrapper.findComponent({ ref: 'userEmailInput' }).exists()).toBe(true)
    expect(wrapper.findComponent({ ref: 'userLastnameInput' }).exists()).toBe(true)
    expect(wrapper.findComponent({ ref: 'userFirstnameInput' }).exists()).toBe(true)
  })

  it('displays input fields when clicking on edit button - MOBILE', async () => {
    expect(wrapper.vm.isEditingUser).toBe(false)

    expect(wrapper.find('#userEmail-mobile').exists()).toBe(true)
    expect(wrapper.find('#userLastname-mobile').exists()).toBe(true)
    expect(wrapper.find('#userFirstname-mobile').exists()).toBe(true)

    expect(wrapper.vm.popUp).toBe(false)

    // clic
    await wrapper.find('#edit-user-button-mobile').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.popUp).toBe(true)
  })

  it('put user form store with updated data', async () => {
    wrapper.vm.isEditingUser = true
    await wrapper.vm.$nextTick()

    wrapper.vm.userEmail = 'new@example.com'
    wrapper.vm.userLastname = 'Smith'
    wrapper.vm.userFirstname = 'Jane'
    await wrapper.vm.$nextTick()

    await wrapper.findComponent(EditButtons).vm.$emit('save')
    await wrapper.vm.$nextTick()

    expect(usersStoreMock.updateUser).toHaveBeenCalledWith(1, {
      email: 'new@example.com',
      profile: {
        lastname: 'Smith',
        firstname: 'Jane',
      },
    })
  })

  it('should cancel update and go back to original values', async () => {
    wrapper.vm.oUserEmail = mockedUser.email
    wrapper.vm.oUserLastname = mockedUser.profile.lastname
    wrapper.vm.oUserFirstname = mockedUser.profile.firstname

    wrapper.vm.isEditingUser = true
    wrapper.vm.userEmail = 'new@example.com'
    wrapper.vm.userLastname = 'Smith'
    wrapper.vm.userFirstname = 'Jane'
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.userEmail).toBe('new@example.com')
    expect(wrapper.vm.userLastname).toBe('Smith')
    expect(wrapper.vm.userFirstname).toBe('Jane')

    await wrapper.findComponent(EditButtons).vm.$emit('cancel')
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.userEmail).toBe(mockedUser.email)
    expect(wrapper.vm.userLastname).toBe(mockedUser.profile.lastname)
    expect(wrapper.vm.userFirstname).toBe(mockedUser.profile.firstname)
    expect(wrapper.vm.isEditingUser).toBe(false)
    expect(wrapper.vm.popUp).toBe(false)
  })

  // DELETE
  it('should open PopUpCard on click on delete button', async () => {
    expect(wrapper.vm.showDeleteConfirm).toBe(false)
    await wrapper.findComponent(EditButtons).vm.$emit('delete')
    expect(wrapper.vm.showDeleteConfirm).toBe(true)
  })

  it('should call deleteUser when click on "Valider"', async () => {
    usersStoreMock.deleteUser = vi.fn()

    wrapper.vm.showDeleteConfirm = true
    await wrapper.vm.$nextTick()

    await wrapper.findComponent(PopUpCard).vm.$emit('confirm')

    expect(usersStoreMock.deleteUser).toHaveBeenCalledWith(mockedUser.id)
    expect(usersStoreMock.deleteUser).toHaveBeenCalledTimes(1)
  })

  it('should close PopUpCard on cancel', async () => {
    usersStoreMock.deleteUser = vi.fn()

    wrapper.vm.showDeleteConfirm = true
    await wrapper.vm.$nextTick()

    await wrapper.findComponent(PopUpCard).vm.$emit('update:popUp')

    expect(wrapper.vm.showDeleteConfirm).toBe(false)

    expect(usersStoreMock.deleteUser).not.toHaveBeenCalled()
  })
})
