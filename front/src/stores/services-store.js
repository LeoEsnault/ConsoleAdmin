import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { getEnterpriseFromStorage } from 'src/utils/getEnterpriseFromStorage'

export const useServicesStore = defineStore('services', {
  state: () => ({
    service: {},
    loading: false,
  }),

  actions: {
    async addService(data) {
      this.loading = true

      const enterprise = getEnterpriseFromStorage()
      if (!enterprise?.id) return

      data.enterprise_id = enterprise.id

      try {
        const response = await api.post(`/services`, data)
        return {
          type: 'positive',
          message: "Le service a été ajouté.",
          data: response.data,
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error)
        let message

        if (
          error?.response?.data?.message === "Un service avec ce nom existe déjà."
        ) {
          message = "Un service avec ce nom existe déjà. Merci d'en choisir un autre."
        } else {
          message = 'Une erreur est survenue.'
        }

        return {
          type: 'negative',
          message,
        }
      } finally {
        this.loading = false
      }
    },

    async updateService(id, data) {
      this.loading = true

      const enterprise = getEnterpriseFromStorage()
      if (!enterprise?.id) return

      data.enterprise_id = enterprise.id

      try {
        const response = await api.put(`/services/${id}`, data)
        console.log('response', response)
        return {
          type: 'positive',
          message: "Le service est à jour.",
          data: response.data
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error)
        return {
          type: 'negative',
          message: 'Une erreur est survenue.'
        }
      } finally {
        this.loading = false
      }
    },

    async deleteService(id) {
      this.loading = true

      try {
        await api.delete(`/services/${id}`)
        return {
          type: 'positive',
          message: "Le service a été supprimé.",
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error)
        return {
          type: 'negative',
          message: 'Une erreur est survenue.'
        }
      } finally {
        this.loading = false
      }
    },
  },
})
