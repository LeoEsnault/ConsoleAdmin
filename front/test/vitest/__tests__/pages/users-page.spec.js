import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import UsersPage from 'src/pages/UsersPage.vue'
import { useUsersStore } from 'src/stores/users-store.js'


describe('UsersPage.vue', () => {
  let usersStoreMock
  let wrapper
  let pinia

  beforeEach(() => {
    vi.clearAllMocks()

    pinia = createTestingPinia({
      createSpy: vi.fn,
      initialState: { usersStore: { users: [] } },
    })

    usersStoreMock = useUsersStore()

    wrapper = mount(UsersPage, {
      global: {
        plugins: [pinia],
      },
    })
  })

  it('fetches users from store with page number 1 and page size 10', async () => {
    expect(usersStoreMock.getUsers).toHaveBeenCalledWith(1, 10)
  })

  it('should fetch users when page changes', async () => {
    usersStoreMock.users = [
      { id: 1, email: 'user1@example.com', firstname: 'John', lastname: 'Doe' },
    ]
    usersStoreMock.totalPages = 2

    wrapper.vm.isLoading = false
    wrapper.vm.totalPages = usersStoreMock.totalPages

    await wrapper.vm.$nextTick()

    const pagination = wrapper.findComponent({ ref: 'pagination' })
    expect(pagination.exists()).toBe(true)

    await pagination.vm.$emit('update:modelValue', 2)

    expect(usersStoreMock.getUsers).toHaveBeenCalledWith(2, 10)
  })

  it('should add user and fetch users after adding', async () => {
    const data = { email: 'newuser@example.com' }
    await usersStoreMock.addUser(data)

    expect(usersStoreMock.addUser).toHaveBeenCalledWith(data)
    expect(usersStoreMock.getUsers).toHaveBeenCalledWith(1, 10)
  })

  it('should handle error when adding user fails', async () => {
    const data = { email: 'invaliduser@example.com' }

    usersStoreMock.addUser = vi.fn().mockRejectedValue(new Error('Failed to add user'))

    await expect(wrapper.vm.addUser(data.email)).rejects.toThrow('Failed to add user')
  })
})
