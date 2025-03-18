import { defineStore } from 'pinia'
import { supabase } from 'src/supabase/supabase'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    messageClass: ''
  }),
  actions: {
    async checkSessionAndRedirect() {
      const router = useRouter()

      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Erreur lors de la récupération de la session :', error.message)
          return
        }

        if (data?.session) {
          this.user = data.session.user
          router.push('/')
        }
      } catch (err) {
        console.error('Erreur inattendue lors de la récupération de la session :', err)
      }
    },
    async handleToken() {
      const urlParams = new URLSearchParams(window.location.search)
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const access_token = urlParams.get('access_token')
      const refresh_token = urlParams.get('refresh_token')
      const error = hashParams.get('error')
      const router = useRouter()

      if (access_token && refresh_token) {
        await supabase.auth.setSession({
          access_token,
          refresh_token
        })
      }
      if (error) {
        console.error('Token manquant dans l\'URL.')
        router.push('/page-not-found')
      }
    },
    async fetchUserRole(user_id) {
      if (!user_id) {
        console.error('user_id est undefined ou null.')
        return {
          type: 'error',
          message: 'Vous n\'avez pas les droits nécessaires pour vous connecter à l\'application'
        }
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', user_id)
          .single()

        if (error) {
          console.error(error)
          return {
            type: 'error',
            message: 'Vous n\'avez pas les droits nécessaires pour vous connecter à l\'application'
          }
        }

        if (!data) {
          console.error('Aucune donnée trouvée pour l\'utilisateur :', user_id)
          return {
            type: 'error',
            message: 'Vous n\'avez pas les droits nécessaires pour vous connecter à l\'application'
          }
        }

        if (data.role !== 'super_admin') {
          console.error('role == ' + data.role)
          return {
            type: 'error',
            message: 'Vous n\'avez pas les droits nécessaires pour vous connecter à l\'application'
          }
        }

        return {
          type: 'success',
          message: 'Autorisation effectuée avec succès.',
          data: data.role
        }
      } catch (error) {
        console.error(error)
        return {
          type: 'error',
          message: 'Vous n\'avez pas les droits nécessaires pour vous connecter à l\'application'
        }
      }
    },
    async logout() {
      await localStorage.removeItem('user_id')
      await localStorage.removeItem('user')

      try {
        const { error } = await supabase.auth.signOut()
        if (error) {
          console.error(error)
          return {
            type: 'error',
            message: 'Une erreur est survenue lors de la déconnexion.'
          }
        }

        this.user = null

        return {
          type: 'success',
          message: 'Vous êtes déconnecté.'
        }

      } catch (error) {
        console.error(error)
        return {
          type: 'error',
          message: 'Une erreur est survenue lors de la déconnexion.'
        }
      }
    },
    async login(email, password) {
      try {
        this.loading = true
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (error) {
          console.error(error)
          return {
            type: 'error',
            message:
              'Impossible de vous identifier, veuillez vérifier votre e-mail et votre mot de passe.'
          }
        }

        if (!data.session) {
          console.error('Session utilisateur introuvable après connexion.')
          return {
            type: 'error',
            message:
              'Impossible de vous identifier, veuillez vérifier votre e-mail et votre mot de passe.'
          }
        }

        this.user = data.user

        return {
          type: 'success',
          message: 'Authentification réussie',
          data: data.user
        }
      } catch (error) {
        console.error(error)
        return {
          type: 'error',
          message:
            'Impossible de vous identifier, veuillez vérifier votre e-mail et votre mot de passe.'
        }
      } finally {
        this.loading = false
      }
    },
    async updatePassword(newPassword) {
      this.loading = true
      try {
        const { error } = await supabase.auth.updateUser({
          password: newPassword
        })

        if (error) {
          if (error.message.includes('New password should be different from the old password.')){
            return {
              type: 'error',
              message: 'Le nouveau mot de passe doit être différent de l\'ancien.'
            }
          }
          else{
          console.error(error)
          return {
            type: 'error',
            message: 'Impossible de mettre à jour votre mot de passe.'
          }
        }
        }
         await supabase.auth.signOut()
        return {
          type: 'success',
          message: 'Mot de passe mis à jour avec succés.'
        }
      } catch (error) {
        console.error(error)
        return {
          type: 'error',
          message: 'Une erreur est survenue. Veuillez réessayer.'
        }
      } finally {
        this.loading = false
      }
    }
  }
})
