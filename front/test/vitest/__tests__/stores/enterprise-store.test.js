import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { api } from 'src/boot/axios';
import { useEnterpriseStore } from 'src/stores/enterprise-store.js'
import { getUserFromStorage } from 'src/utils/helpers'

vi.mock('src/boot/axios');
vi.mock('src/utils/helpers', () => ({
  getUserFromStorage: vi.fn()
}));

describe('Enteprise Store', () => {
  let store

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useEnterpriseStore()
    localStorage.setItem('enterprise', JSON.stringify({ id: 1 }))
  })

  it('should initialize with default state', () => {
    expect(store.enterprise).toStrictEqual({})
    expect(store.enterprises).toStrictEqual([])
    expect(store.loading).toBe(false)
  })

  describe('Get Enterprise', () => {
    const mockUser = { id: "user-123" };

    beforeEach(() => {
      getUserFromStorage.mockReturnValue(mockUser);
    });

    it('fetches the enterprise of connected user', async () => {
      const mockEnterprise = { id: "ent-123", name: "Hello" };
      api.get.mockResolvedValueOnce({ data: mockEnterprise })

      await store.getEnterprise()
      expect(api.get).toHaveBeenCalledWith(`/users/${mockUser.id}/enterprise`);
      expect(store.enterprise).toEqual(mockEnterprise);
      const savedEnterprise = JSON.parse(localStorage.getItem('enterprise'));
      expect(savedEnterprise).toEqual(mockEnterprise);
    })

    it('handles error when fetching the enterprise', async () => {
      api.get.mockRejectedValueOnce(new Error('Erreur lors de la récupération des données'));

      await store.getEnterprise();

      expect(api.get).toHaveBeenCalledWith(`/users/${mockUser.id}/enterprise`);
      expect(store.enterprise).toStrictEqual({});
    });
  })

  describe("Get Enterprises", () => {
    it('fetches all enterprises', async () => {
      const mockEnterprises = [{ id: "ent-123", name: "Hello" }, { id: "ent-456", name: "Bye" }];
      api.get.mockResolvedValueOnce({ data: mockEnterprises })

      await store.getEnterprises()
      expect(api.get).toHaveBeenCalledWith(`/enterprises`);
      expect(store.enterprises).toEqual(mockEnterprises);
    })

    it('handles error when fetching enterprises', async () => {
      api.get.mockRejectedValueOnce(new Error('Erreur lors de la récupération des données'));

      await store.getEnterprises();

      expect(api.get).toHaveBeenCalledWith(`/enterprises`);
      expect(store.enterprises).toStrictEqual([]);
    });
  })
})
