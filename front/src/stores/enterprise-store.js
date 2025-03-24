import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import { getUserFromStorage } from 'src/utils/helpers'

export const useEnterpriseStore = defineStore('enterprises', {
  state: () => ({
    enterprise: {},
    enterprises: [],
    loading: false,
  }),

  actions: {
    async getEnterprise() {

      const user = getUserFromStorage()

      try {
        const response = await api.get(`/users/${user.id}/enterprise`)
        this.enterprise = response.data || {}
        localStorage.setItem('enterprise', JSON.stringify(this.enterprise))
        return response.data
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error)
        return (this.enterprise = {})
      }
    },

    async getEnterprises() {
      try {
        const response = await api.get(`/enterprises`)
        this.enterprises = response.data || {}
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error)
        return (this.enterprise = [])
      }
    },
  },
})
