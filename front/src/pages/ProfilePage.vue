<template>
  <q-page class="column q-px-xl q-gutter-y-md flex justify-center">
    <h2 style="color: #263286; text-align: center; ">Modifiez vos Informations</h2>
        <q-form
          @submit="updateProfil()"
          class="q-gutter-md"
          id="formProfile"
        >
          <div class="row" id ='inputProfile0' style="margin-left: 10%;">
            <p class="col-md-2 q-my-auto text-blue">Nom</p>
            <div class="col-12 col-md-7">
            <q-input v-model="lastName" color="blue" outlined dense type="text"  maxlength="40"></q-input>
            </div>
          </div>
          <div class="row" style="margin-left: 10%;" id ='inputProfile1'>
            <p class="col-md-2 q-my-auto text-blue">Prénom</p>
            <div class="col-12 col-md-7">
            <q-input v-model="firstName" color="blue" outlined dense type="text" maxlength="40"></q-input>
           </div>
          </div>
          <div class="row" style="margin-left: 10%;">
            <p class="col-md-2 q-my-auto text-blue">Email</p>
            <div class="col-12 col-md-7">
            <q-input v-model="email" color="blue" outlined dense type="email"  maxlength="40" ></q-input>
           </div>
          </div>
           <div class="row" style="margin-left: 10%;">
            <p class="col-md-2 q-my-auto text-blue">Téléphone</p>
            <div class="col-12 col-md-7">
              <q-input
                v-model="phone"
                color="blue"
                outlined
                dense
                type="phone"
                @blur="formatPhone"
                maxlength="20"
                id="inputPhone"
              ></q-input>
            </div>
          </div>
          <div class="mdpForgetProfilLink" style="text-align: center; margin-top: 5vh;">
             <RouterLink to="/update-password" class="mdpForget">Modifier mon mot de passe</RouterLink>
        </div>
          <div class="flex flex-center q-pt-lg">
            <q-btn
              label="Enregistrer"
              type="submit"
              style="margin-top: -1.5vh;"
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
import { Notify } from 'quasar';


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

const fetchUserProfil = async () => {
  try {
    const { mail, lastname, firstname, telephone } = await profilStore.fetchUserProfil();
    
    lastName.value = lastname;
    firstName.value = firstname;
    email.value = mail;
    phone.value = telephone;
    
} catch (error) {
  Notify.create({ message: "Une erreur est survenue.", type: "negative" });
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
    if (!error) {
      $q.notify({
        message: 'Vos informations ont été mises à jour.',
        type: 'positive',
        position: 'bottom-right',
      })
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil', error);
    $q.notify({
      message: 'Erreur lors de la mise à jour, veuillez vérifier vos informations',
      type: 'negative',
      position: 'bottom-right',
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
    width: 70%;
    margin-left: 15%
  }
  .icone:hover {
    color: #742282;
  }
  h2{
    font-size: x-large;
  }
  @media (max-width: 1024px) {
 form{
  margin-left: 12%;
 }
  
}

  @media screen and (min-width: 1500px) {
    form {
      width: 50%;
      margin-left: 25%
    }
  }
  @media screen and (max-width: 500px){
    form{
      margin-top: -1vh;
      margin-left: 14%;
    }

    h2{
      font-size: 20px;
    }
    div{
      margin-left: 0% !important;
    }
  }
  </style>
 
