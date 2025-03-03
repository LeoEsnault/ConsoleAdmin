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

    usersStoreMock.getUsers = vi.fn().mockImplementation(async () => {
      usersStoreMock.users = [
        { id: 1, email: 'user1@example.com', firstname: 'John', lastname: 'Doe' },
        { id: 2, email: 'user2@example.com', firstname: 'Jane', lastname: 'Doe' },
        { id: 3, email: 'user3@example.com', firstname: 'Alice', lastname: 'Smith' },
        { id: 4, email: 'user4@example.com', firstname: 'Bob', lastname: 'Johnson' },
        { id: 5, email: 'user5@example.com', firstname: 'Charlie', lastname: 'Brown' },
        { id: 6, email: 'user6@example.com', firstname: 'David', lastname: 'Wilson' },
        { id: 7, email: 'user7@example.com', firstname: 'Eve', lastname: 'Adams' },
        { id: 8, email: 'user8@example.com', firstname: 'Frank', lastname: 'Moore' },
        { id: 9, email: 'user9@example.com', firstname: 'Grace', lastname: 'Taylor' },
        { id: 10, email: 'user10@example.com', firstname: 'Hannah', lastname: 'Lopez' },
      ]
      usersStoreMock.totalPages = 2
    })

    usersStoreMock.addUser = vi.fn().mockResolvedValue({
      id: 1,
      email: 'newuser@example.com',
      profile: { auth_id: '1', firstname: '', id: '2', lastname: '' },
    })

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
    expect(usersStoreMock.getUsers).toHaveBeenCalled(1, 10)
  })

  it('should handle error when adding user fails', async () => {
    const data = { email: 'invaliduser@example.com' }

    usersStoreMock.addUser = vi.fn().mockRejectedValue(new Error('Failed to add user'))

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    await wrapper.vm.addUser(data.email)

    expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error))

    consoleSpy.mockRestore()
  })
})
