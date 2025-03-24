import { defineStore } from 'pinia';
import { supabase } from 'src/supabase/supabase';
import { api } from 'src/boot/axios';
import { getUserFromStorage } from 'src/utils/getUserFromStorage';

export const useProfilStore = defineStore('profil', {
  state: () => ({
    user: null,
  }),

  actions: {
    async fetchUserProfil() {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        let user_id = user ? user.id : null;

        const { data, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Erreur lors de la récupération de la session :", sessionError.message);
        }

        if (data?.session?.user?.id) {
          console.log("Session existante pour l'utilisateur");
          user_id = data.session.user.id;
          localStorage.setItem('user', JSON.stringify(data.session.user));
        } else {
          console.log("Aucune session active.");
        }
        if (!user_id) {
          console.error("Aucun ID utilisateur trouvé.");
        }
        const response = await api.get(`/profiles/${user_id}`);

        const firstname = response.data.profile.firstname; 
        const lastname = response.data.profile.lastname;
        const mail = response.data.user.user.email;
        const telephone = response.data.user.user.phone;
        
        return { mail, firstname, lastname, telephone };
        
      } catch (error) {
        console.error("Erreur inattendue :", error.message);
      }
    },

    async updateProfil(data) {
      this.loading = true;

      try {
        const user = JSON.parse(localStorage.getItem('user'));
        let user_id = user ? user.id : null;

        if (!user_id) {
          console.error("Aucun ID utilisateur trouvé");
        }

        const { data: response, error } = await api.put(`/profiles/${user_id}`, data);

        if (error) {
          return { error };
        }

        return {
          data: response,
        };
      }
      catch (error) {
        console.error("Erreur lors de la mise à jour :", error);

      } finally {
        this.loading = false;
      }
    },

    async getUserFromStorage() {
      this.user = getUserFromStorage()
    },

    async updatePassword(newPassword) {
      this.loading = true
      const user = JSON.parse(localStorage.getItem('user'));
      let id = user ? user.id : null;   

      try {
        const { error } = await api.put(`/update/${id}`, newPassword)
        
          if (error) {
          console.error(error)
          return {
            type: 'error',
            message: 'Impossible de mettre à jour votre mot de passe.'
          }
        }
        return {
          type: 'success',
          message: 'Mot de passe mis à jour avec succés.'
        }
      } catch (error) {
        console.error(error)
        return {
          type: 'error',
          message: 'Une erreur est survenue. Veuillez verifier votre mot de passe.'
        }
      } finally {
        this.loading = false
      }
    }

  }
});
