<template>
  <div class="bg-image">
    <q-img src="/assets/LogoHeriadeCouleur.png" fit="contain" style="height: 7rem; z-index: 50" class="q-mt-lg"
      id="logoForgetPassword">
    </q-img>
    <div class="flex justify-center">
      <q-form @submit.prevent="sendRequest" class="bg-white rounded-borders q-pa-lg q-my-lg"
        style="box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1); max-width: 600px" id="formForgetPassword">
        <h1 class="text-h5 text-center" style="color: #263286;">Mot de passe oublié ?</h1>
        <p class="text-center q-mb-xl">
          Veuillez entrer l'adresse e-mail associée à votre compte. Nous vous
          enverrons un lien pour réinitialiser votre mot de passe.
        </p>

        <div class="q-mb-lg">
          <p class="text-purple q-mb-sm">Email</p>
          <q-input outlined dense type="email" v-model="email" placeholder="utilisateur@email.com" required lazy-rules
            :rules="[
              (val) =>
                (val && val.length > 3) ||
                'Veuillez renseigner un email valide.',
            ]" class="q-mb-lg" autofocus />
        </div>

        <div class="flex flex-center q-pt-lg">
          <q-btn id="h__forgot_password_btn" @click="sendRequest" :disable="!email || email.length < 4" label="Envoyer"
            :loading="loading" no-caps padding="sm xl" class="modern-primary-btn">
            <template v-slot:loading>
              <q-spinner-ios />
            </template>
          </q-btn>
        </div>
      </q-form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { supabase } from 'src/supabase/supabase';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router'

const email = ref('');
const loading = ref(false);
const $q = useQuasar();

const router = useRouter()

const frontUrl = computed(() => {
  return process.env.FRONT_URL
})
// Envoie le lien pour le reset du mdp
async function sendRequest() {
  loading.value = true;
  try {
    await supabase.auth.resetPasswordForEmail(email.value, {
      redirectTo: `${frontUrl.value}/reset-password`,
    });
    $q.notify({
      message: "Un lien de réinitialisation a été envoyé sur votre e-mail.",
      type: "positive",
    });
  }
  catch (err) {
    console.error("Erreur lors de l'envoi de la demande de réinitialisation :", err);
    $q.notify({
      message: "Une erreur s'est produite. Veuillez réessayer.",
      type: "negative",
    });
  } finally {
    loading.value = false;
    router.push("/login")
  }
}
</script>

<style scoped>
@import 'src/css/style.css';
</style>
