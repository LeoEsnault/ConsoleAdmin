import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { api } from 'src/boot/axios';
import { useServicesStore } from 'src/stores/services-store.js'
import { getEnterpriseFromStorage } from 'src/utils/getEnterpriseFromStorage'

vi.mock('src/boot/axios');
vi.mock('src/utils/getEnterpriseFromStorage', () => ({
  getEnterpriseFromStorage: vi.fn()
}));

describe('Service Store', () => {
  let store

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useServicesStore()
  })

  it('should initialize with default state', () => {
    expect(store.service).toStrictEqual({})
    expect(store.loading).toBe(false)
  })

  describe("Post Service", () => {
    const mockEnterprise = { id: "ent-123" };

    const mockData = {
      name: 'service',
    };

    beforeEach(() => {
      getEnterpriseFromStorage.mockReturnValue(mockEnterprise);
    });

    it('devrait créer un nouvel service', async () => {
      const responseData = {
        id: 'ser-123',
        name: 'service',
        enterprise_id: 'ent-123',
      };

      const responseMessage = {
        type: 'positive',
        message: "Le service a été ajouté.",
        data: responseData,
      };

      api.post.mockResolvedValueOnce({ data: responseData })
      const result = await store.addService(mockData);
      expect(api.post).toHaveBeenCalledWith('/services', mockData);
      expect(result).toEqual(responseMessage);
    })

    it('handles error when fetching services', async () => {
      api.post.mockRejectedValueOnce(new Error('Erreur lors de la récupération des données'));

      await store.addService(mockData);

      expect(api.post).toHaveBeenCalledWith('/services', mockData);
    });
  })

  describe("Put Service", () => {
    const mockId = 'ser-123'
    const mockEnterprise = { id: "ent-123" };
    const mockData = { name: "établisssement" }

    beforeEach(() => {
      getEnterpriseFromStorage.mockReturnValue(mockEnterprise);
    });

    it('updates an service successfully', async () => {
      const responseData = {
        id: 'ser-123',
        name: 'service',
        enterprise_id: 'ent-123',
      };

      const responseMessage = {
        type: 'positive',
        message: "Le service est à jour.",
        data: responseData
      }

      api.put.mockResolvedValueOnce({ data: responseData })

      const result = await store.updateService(mockId, mockData)
      expect(api.put).toHaveBeenCalledWith(`/services/${mockId}`, mockData)
      expect(result).toEqual(responseMessage)
    })

    it('handles error when updating an service', async () => {
      const errorResponse = {
        type: 'negative',
        message: 'Une erreur est survenue.',
      }

      api.put.mockRejectedValueOnce(new Error('API Error'))

      const result = await store.updateService(mockId, mockData)
      expect(result).toEqual(errorResponse)
    })
  })

  describe("Delete Service", () => {
    const mockId = 'ser-123'

    it('deletes an service successfully', async () => {
      const responseMessage = {
        type: 'positive',
        message: "Le service a été supprimé.",
      }

      api.delete.mockResolvedValueOnce({ data: 'ok' })

      const result = await store.deleteService(mockId)

      expect(api.delete).toHaveBeenCalledWith(`/services/${mockId}`)
      expect(result).toEqual(responseMessage)
    })

    it('handles error when deleting an service', async () => {
      const errorResponse = {
        type: 'negative',
        message: 'Une erreur est survenue.',
      }

      api.delete.mockRejectedValueOnce(new Error('API Error'))

      const result = await store.deleteService(mockId)
      expect(result).toEqual(errorResponse)
    })
  })
})
