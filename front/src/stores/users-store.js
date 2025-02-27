import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import qs from 'qs'
import { Notify } from 'quasar'

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: null,
    loading: false,
  }),

  actions: {
    async getUsers(page, usersPerPage) {
      try {
        const query = qs.stringify(
          {
            page: page,
            pageSize: usersPerPage,
          },
          {
            encodeValuesOnly: true,
          },
        )

        const response = await api.get(`/users?${query}`)
        return response.data
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error)
        return []
      }
    },

    async addUser(data) {
      try {
        const response = await api.post(`/users`, data)

        Notify.create({
          message: "L'utilisateur a été ajouté.",
          type: 'positive',
          position: 'top',
        })

        return response.data
      } catch (error) {
        console.error(error)

        Notify.create({
          message: 'Une erreur est survenue.',
          type: 'negative',
          position: 'top',
        })
      }
    },

    async updateUser(id, data) {
      try {
        const response = await api.put(`/users/${id}`, data)

        Notify.create({
          message: "L'utilisateur est à jour.",
          type: 'positive',
          position: 'top',
        })

        return response.data
      } catch (error) {
        console.error(error)

        Notify.create({
          message: 'Une erreur est survenue.',
          type: 'negative',
          position: 'top',
        })
      }
    },

    async deleteUser(id) {
      this.loading = true
      try {
        const response = await api.delete(`/users/${id}`)

        Notify.create({
          message: "L'utilisateur a été supprimé.",
          type: 'positive',
          position: 'top',
        })

        return response.data
      } catch (error) {
        console.error(error)

        Notify.create({
          message: 'Une erreur est survenue.',
          type: 'negative',
          position: 'top',
        })
      } finally {
        this.loading = false
      }
    },
  },
})
