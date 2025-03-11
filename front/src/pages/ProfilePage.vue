<template> 
   <q-page class="desktop-only column q-px-xl q-gutter-y-md flex justify-center">
    <h2 style="color: #263286; text-align: center; font-size: xx-large;">Modifiez vos Informations</h2>
        <q-form
          @submit="updateProfil()"
          class="q-gutter-md"
        >
          <div class="row" id ='inputProfile0'>
            <p class="col-4 q-my-auto text-blue">Nom</p>
            <q-input v-model="lastName" color="blue" outlined dense type="text" class="col-8" ></q-input>
          </div>
          <div class="row" id ='inputProfile1'>
            <p class="col-4 q-my-auto text-blue">Prénom</p>
            <q-input v-model="firstName" color="blue" outlined dense type="text" class="col-8"></q-input>
          </div>
          <div class="row">
            <p class="col-4 q-my-auto text-blue">Email</p>
            <q-input v-model="email" color="blue" outlined dense type="email" class="col-8"></q-input>
          </div>
          <div class="row">
            <p class="col-4 q-my-auto text-blue">Téléphone</p>
            <q-input v-model="phone" color="blue" outlined dense type="phone" class="col-8" @blur="formatPhone" ></q-input>
          </div>
          <div class="flex flex-center q-pt-lg">
            <q-btn
              label="Enregistrer"
              type="submit"
              :loading="profilStore.loading"
              no-caps
              padding="sm xl"
              class="modern-primary-btn"
              id="buttonProfilPage"
            >
              <template v-slot:loading>
                <q-spinner-ios />
              </template>
            </q-btn>
          </div>
        </q-form>
    </q-page>
  </template>
  
  <script setup>
import { ref } from "vue";
import { useProfilStore } from "src/stores/profil-store"; 
import { onMounted } from "vue";
import { useQuasar } from 'quasar';


const profilStore = useProfilStore();
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const phone = ref('');
const $q = useQuasar();

const formatPhone = () => {
      const cleanPhone = phone.value.replace(/\D/g, ''); 
      if (cleanPhone.length === 10) {
        phone.value = `+33${cleanPhone.slice(1, 3)}${cleanPhone.slice(3, 5)}${cleanPhone.slice(5, 7)}${cleanPhone.slice(7, 9)}${cleanPhone.slice(9, 10)}`;
      }
    }

const fetchUserProfil = async() => {
  try {
    const { mail, name } = await profilStore.fetchUserProfil();
    
    lastName.value = name.lastname;
    firstName.value = name.firstname;
    email.value = mail.email;
    phone.value = mail.phone;
    
} catch (error) {
  return error
}
};

onMounted(() => {
  fetchUserProfil();
});

const updateProfil = async () => {
  const data = {
    lastname: lastName.value,
    firstname: firstName.value,
    email: email.value,
    phone: phone.value
  };
  

  try {
   const { error } = await profilStore.updateProfil(data);
   if(!error) {
    $q.notify({
      message: 'Vos informations ont été mises à jour.',
      type: 'positive',
    })
    console.log('Profil mis à jour avec succès', data)
  }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil', error);
    $q.notify({
      message: 'Erreur lors de la mise à jour de vos informations.',
      type: 'negative',
    })
  }
};

  </script>
  
  <style scoped>
  @import 'src/css/style.css';
  form {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    height: 60vh;
  }
  .icone:hover {
    color: #742282;
  }

  </style>
 