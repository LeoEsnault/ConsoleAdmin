import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { getEnterpriseFromStorage } from 'src/utils/getEnterpriseFromStorage'

export const useEstablishmentsStore = defineStore('establishments', {
  state: () => ({
    establishment: {},
    loading: false,
  }),

  actions: {
    async addEstablishment(data) {
      this.loading = true

      const enterprise = getEnterpriseFromStorage()
      if (!enterprise?.id) return

      data.enterprise_id = enterprise.id

      try {
        const response = await api.post(`/establishments`, data)
        return {
          type: 'positive',
          message: "L'établissement a été ajouté.",
          data: response.data,
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error)
        let message

        if (
          error?.response?.data?.message === "Un établissement avec ce nom existe déjà."
        ) {
          message = "Un établissement avec ce nom existe déjà. Merci d'en choisir un autre."
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

    async updateEstablishment(id, data) {
      this.loading = true

      const enterprise = getEnterpriseFromStorage()
      if (!enterprise?.id) return

      data.enterprise_id = enterprise.id

      try {
        const response = await api.put(`/establishments/${id}`, data)
        console.log('response', response)
        return {
          type: 'positive',
          message: "L'établissement est à jour.",
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

    async deleteEstablishment(id) {
      this.loading = true

      try {
        await api.delete(`/establishments/${id}`)
        return {
          type: 'positive',
          message: "L'établissement a été supprimé.",
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
