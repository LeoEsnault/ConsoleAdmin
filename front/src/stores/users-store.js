import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import qs from 'qs'

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

        return {
          type: 'positive',
          message: "L'utilisateur a été ajouté.",
          data: response.data,
        }
      } catch (error) {
        console.error(error)
        let message

        if (
          error?.response?.data?.message === 'Un utilisateur avec cette adresse e-mail existe déjà.'
        ) {
          message = "L'utilisateur avec cet identifiant existe déjà. Merci d'en choisir un autre."
        } else {
          message = 'Une erreur est survenue.'
        }

        return {
          type: 'negative',
          message,
        }
      }
    },

    async updateUser(id, data) {
      try {
        const response = await api.put(`/users/${id}`, data)

        return {
          type: 'positive',
          message: "L'utilisateur est à jour.",
          data: response.data,
        }
      } catch (error) {
        console.error(error)

        return {
          type: 'negative',
          message: 'Une erreur est survenue.',
        }
      }
    },

    async deleteUser(id) {
      this.loading = true
      try {
        const response = await api.delete(`/users/${id}`)

        return {
          type: 'positive',
          message: "L'utilisateur a été supprimé.",
          data: response.data,
        }
      } catch (error) {
        console.error(error)

        return {
          type: 'positive',
          message: 'Une erreur est survenue.',
        }
      } finally {
        this.loading = false
      }
    },
  },
})
