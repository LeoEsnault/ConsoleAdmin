import { defineStore } from 'pinia'
// import { api } from 'boot/axios'
// import qs from 'qs'

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [],
    loading: false,
  }),

  actions: {
  
  },
})
