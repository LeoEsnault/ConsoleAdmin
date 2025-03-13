import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { api } from 'src/boot/axios';
import { useUsersStore } from 'src/stores/users-store.js'

vi.mock('src/boot/axios');

describe('Users Store', () => {
  let store

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useUsersStore()
    localStorage.setItem('enterprise', JSON.stringify({ id: 1 }))
  })

  it('should initialize with default state', () => {
    expect(store.users).toStrictEqual([])
    expect(store.loading).toBe(false)
  })

  describe('Get Users', () => {
    it('fetches users successfully', async () => {
      const mockData = { users: [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }], totalPages: 2 };
      api.get.mockResolvedValueOnce({ data: mockData })

      const result = await store.getUsers(1, 10)
      expect(api.get).toHaveBeenCalled()
      expect(result).toEqual(mockData)
    })

    it('returns an empty array when the API call fails', async () => {
      api.get.mockRejectedValueOnce(new Error('API Error'))

      const result = await store.getUsers(1, 10)
      expect(result).toEqual([])
    })
  })

  describe('Add User', () => {
    const mockData = {
      email: 'john@doe.fr',
      enterprise: 'ent-123',
    };

    it('adds a user successfully', async () => {
      const responseData = {
        id: 'user-123',
        email: 'john@doe.fr',
        profile: {
          user_id: 'user-123',
          firstname: '',
          lastname: '',
          id: 'profile-123',
          enterprise_id: 'ent-123',
        },
      };

      const responseMessage = {
        type: 'positive',
        message: "L'utilisateur a été ajouté.",
        data: responseData,
      };
      api.post.mockResolvedValueOnce({ data: responseData });

      const result = await store.addUser(mockData);
      expect(api.post).toHaveBeenCalledWith('/users', mockData);
      expect(result).toEqual(responseMessage);
    });

    it('handles error when adding a user', async () => {
      const errorResponse = {
        type: 'negative',
        message: 'Une erreur est survenue.'
      };

      api.post.mockRejectedValueOnce({
        response: { data: { message: 'Une erreur est survenue.' } },
      });

      const result = await store.addUser(mockData);
      expect(result).toEqual(errorResponse);
    });

    it('handles error when email already exist in database', async () => {
      const errorResponse = {
        type: 'negative',
        message: "L'utilisateur avec cet identifiant existe déjà. Merci d'en choisir un autre.",
      };

      api.post.mockRejectedValueOnce({
        response: { data: { message: 'Un utilisateur avec cette adresse e-mail existe déjà.' } },
      });

      const result = await store.addUser(mockData);
      expect(result).toEqual(errorResponse);
    });
  });

  describe('Update User', () => {
    const mockId = 'user-1'
    const mockData = { id: mockId, email: 'alice.doe@example.com', profile: { lastname: 'Alice Updated', firstname: 'Doe Updated' } }

    it('updates a user successfully', async () => {
      const updatedResponse = mockData

      const responseMessage = {
        type: 'positive',
        message: "L'utilisateur est à jour.",
        data: updatedResponse,
      }

      api.put.mockResolvedValueOnce({ data: updatedResponse })

      const result = await store.updateUser(mockId, mockData)
      expect(api.put).toHaveBeenCalledWith(`/users/${mockId}`, mockData)
      expect(result).toEqual(responseMessage)
    })

    it('handles error when updating a user', async () => {
      const errorResponse = {
        type: 'negative',
        message: 'Une erreur est survenue.',
      }

      api.put.mockRejectedValueOnce(new Error('API Error'))

      const result = await store.updateUser(mockId, mockData)
      expect(result).toEqual(errorResponse)
    })
  })

  describe('Delete User', () => {
    const mockId = 'user-123'

    it('deletes a user successfully', async () => {
      const responseMessage = {
        type: 'positive',
        message: "L'utilisateur a été supprimé.",
      }

      api.delete.mockResolvedValueOnce({ data: 'ok' })

      const result = await store.deleteUser(mockId)

      expect(api.delete).toHaveBeenCalledWith(`/users/${mockId}`)
      expect(result).toEqual(responseMessage)
    })

    it('handles error when deleting a user', async () => {
      const errorResponse = {
        type: 'positive',
        message: 'Une erreur est survenue.',
      }

      api.delete.mockRejectedValueOnce(new Error('API Error'))

      const result = await store.deleteUser(mockId)
      expect(result).toEqual(errorResponse)
    })
  })
})
