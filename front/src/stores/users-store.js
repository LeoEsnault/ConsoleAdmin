import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import qs from 'qs'

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: null,
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
        console.log('RESPONSE', response)
        return response.data
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error)
        return []
      }
    },
  },
})
