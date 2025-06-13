import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [],
    loading: false,
  }),

  actions: {
    async getUsers(page = 1, limit = 10) {
      this.loading = true
      try {
        const response = await api.get('/users', {
          params: {
            page,
            limit,
          },
        })
        console.log('Réponse de l\'API:', response.data)
        this.users = response.data
        return {
          users: response.data,
          totalPages: 1, // Ajustez selon votre logique de pagination
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs', error)
        return {
          users: [],
          totalPages: 1,
        }
      } finally {
        this.loading = false
        console.log('Utilisateurs chargés:', this.users)
      }
    },
  },
})
