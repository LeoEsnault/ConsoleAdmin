import { defineStore } from 'pinia';
import { supabase } from 'src/supabase/supabase';
import { Notify } from 'quasar';
import { api } from 'src/boot/axios';



export const useProfilStore = defineStore('profil', {
  state: () => ({
    user: null,
  }),

  actions: {
    async fetchUserProfil() {
      try {
       
        let user_id = localStorage.getItem("user_id"); 
    
        
        const { data, error: sessionError } = await supabase.auth.getSession();
    
        if (sessionError) {
          console.error("Erreur lors de la récupération de la session :", sessionError.message);
        }
    
        if (data?.session?.user?.id) {
          console.log("Session existante pour l'utilisateur");
          user_id = data.session.user.id; 
          localStorage.setItem("user_id", user_id); 
        } else {
          console.log("Aucune session active.");
        }
    
       
        if (!user_id) {
          console.error("Aucun ID utilisateur trouvé.");
        }
    
        
        const response = await api.get(`/profiles/${user_id}`);

        const name = response.data.data;

        const mail = response.data.user.user

        return { mail, name} ;
        
    
      } catch (error) {
        console.error("Erreur inattendue :", error.message);
        Notify.create({ message: "Une erreur est survenue.", type: "negative" });
      }
    },
    async updateProfil(data) {
      this.loading = true;
    
      try {
        const user_id = localStorage.getItem("user_id");
        if (!user_id) {
          console.error("Aucun ID utilisateur trouvé");
        }
    
        const { data: response, error } = await api.put(`/profiles/${user_id}`, data);

        if ( error ) {
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
    }
    
}});
