import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import UsersPage from 'src/pages/UsersPage.vue'
import { useUsersStore } from 'src/stores/users-store.js'

describe('UsersPage.vue', () => {
  let usersStoreMock

  beforeEach(() => {
    vi.clearAllMocks()

    const pinia = createTestingPinia({
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

    mount(UsersPage, {
      global: {
        plugins: [pinia],
      },
    })
  })

  it('fetches users from store with page number 1 and page size 10', async () => {
    expect(usersStoreMock.getUsers).toHaveBeenCalledWith(1, 10)
  })

  it('should fetch users when page changes', async () => {
    const pinia = createTestingPinia({ createSpy: vi.fn })
    const usersStore = useUsersStore()

    usersStore.users = [{ id: 1, email: 'user1@example.com', firstname: 'John', lastname: 'Doe' }]
    usersStore.totalPages = 2

    const wrapper = mount(UsersPage, {
      global: {
        plugins: [pinia],
      },
    })

    wrapper.vm.isLoading = false

    await wrapper.vm.$nextTick()

    const pagination = wrapper.findComponent({ ref: 'pagination' })
    expect(pagination.exists()).toBe(true)

    await pagination.vm.$emit('update:model-value', 2)

    expect(usersStore.getUsers).toHaveBeenCalledWith(2, 10)
  })
})
