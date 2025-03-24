import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { api } from 'src/boot/axios';
import { useEstablishmentsStore } from 'src/stores/establishments-store.js'
import { getEnterpriseFromStorage } from 'src/utils/getEnterpriseFromStorage'

vi.mock('src/boot/axios');
vi.mock('src/utils/getEnterpriseFromStorage', () => ({
  getEnterpriseFromStorage: vi.fn()
}));

describe('Establishment Store', () => {
  let store

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useEstablishmentsStore()
  })

  it('should initialize with default state', () => {
    expect(store.establishment).toStrictEqual({})
    expect(store.loading).toBe(false)
  })

  describe("Post Establishment", () => {
    const mockEnterprise = { id: "ent-123" };

    const mockData = {
      // id: "ent-123",
      name: 'établissement',
    };

    beforeEach(() => {
      getEnterpriseFromStorage.mockReturnValue(mockEnterprise);
    });

    it('devrait créer un nouvel établissement', async () => {
      const responseData = {
        id: 'esta-123',
        name: 'établissement',
        enterprise_id: 'ent-123',
      };

      const responseMessage = {
        type: 'positive',
        message: "L'établissement a été ajouté.",
        data: responseData,
      };

      api.post.mockResolvedValueOnce({ data: responseData })
      const result = await store.addEstablishment(mockData);
      expect(api.post).toHaveBeenCalledWith('/establishments', mockData);
      expect(result).toEqual(responseMessage);
    })

    it('handles error when fetching establishments', async () => {
      api.post.mockRejectedValueOnce(new Error('Erreur lors de la récupération des données'));

      await store.addEstablishment(mockData);

      expect(api.post).toHaveBeenCalledWith('/establishments', mockData);
    });
  })

  describe("Put Establishment", () => {
    const mockId = 'est-123'
    const mockEnterprise = { id: "ent-123" };
    const mockData = { name: "établisssement" }

    beforeEach(() => {
      getEnterpriseFromStorage.mockReturnValue(mockEnterprise);
    });

    it('updates an establishment successfully', async () => {
      const responseData = {
        id: 'esta-123',
        name: 'établissement',
        enterprise_id: 'ent-123',
      };

      const responseMessage = {
        type: 'positive',
        message: "L'établissement est à jour.",
        data: responseData
      }

      api.put.mockResolvedValueOnce({ data: responseData })

      const result = await store.updateEstablishment(mockId, mockData)
      expect(api.put).toHaveBeenCalledWith(`/establishments/${mockId}`, mockData)
      expect(result).toEqual(responseMessage)
    })

    it('handles error when updating an establishment', async () => {
      const errorResponse = {
        type: 'negative',
        message: 'Une erreur est survenue.',
      }

      api.put.mockRejectedValueOnce(new Error('API Error'))

      const result = await store.updateEstablishment(mockId, mockData)
      expect(result).toEqual(errorResponse)
    })
  })

  describe("Delete Establishment", () => {
    const mockId = 'est-123'

    it('deletes an establishment successfully', async () => {
      const responseMessage = {
        type: 'positive',
        message: "L'établissement a été supprimé.",
      }

      api.delete.mockResolvedValueOnce({ data: 'ok' })

      const result = await store.deleteEstablishment(mockId)

      expect(api.delete).toHaveBeenCalledWith(`/establishments/${mockId}`)
      expect(result).toEqual(responseMessage)
    })

    it('handles error when deleting an establishment', async () => {
      const errorResponse = {
        type: 'negative',
        message: 'Une erreur est survenue.',
      }

      api.delete.mockRejectedValueOnce(new Error('API Error'))

      const result = await store.deleteEstablishment(mockId)
      expect(result).toEqual(errorResponse)
    })
  })
})
