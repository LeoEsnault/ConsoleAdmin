<template>
  <q-layout view="lHh Lpr lFf" class="bg-image">
    <q-page-container>
      <q-page class="flex justify-center items-center" @keyup.enter="handleLogin">
        <div style="width: 100%; max-width: 500px; height: 100%" class="q-mb-xl">
          <q-img src="logo2.jpg" fit="contain" style="height: 7rem; z-index: 50"
            class="q-mt-lg"></q-img>
          <q-form class="bg-white rounded-borders q-pa-lg q-ma-sm q-my-xl"
            style="box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1)">
            <h1 class="text-h5 text-center" style="color: #263286 !important;">Connexion</h1>

            <div class="q-pb-md">
              <p class="text-purple q-mb-sm">Email</p>
              <q-input outlined dense type="email" v-model="email" required lazy-rules :rules="[
                (val) =>
                  (val && val.length > 3) ||
                  'Veuillez renseigner un identifiant valide.',
              ]" class="q-mb-lg" />
            </div>

            <div>
              <p class="text-purple q-mb-sm">Mot de passe</p>
              <q-input outlined dense :type="isPwd ? 'password' : 'text'" v-model="password" required :rules="[
                (val) =>
                  (val && val.length > 2) ||
                  'Veuillez renseigner un mot de passe valide.',
              ]" class="">
                <template v-slot:append>
                  <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" size="sm"
                    @click="isPwd = !isPwd" />
                </template>
              </q-input>
              <div class="mdpForgetRight">
                <RouterLink to="/forgot-password" class="mdpForget">Mot de passe oublié</RouterLink>
              </div>
            </div>

            <div class="flex flex-center q-pt-lg">
              <q-btn id="h__login_btn" @click="handleLogin" label="Connexion" :disable="invalid"
                :loading="authStore.loading" no-caps padding="sm xl" class="modern-primary-btn">
                <template v-slot:loading>
                  <q-spinner-ios />
                </template>
              </q-btn>
            </div>
          </q-form>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/auth-store.js'
import { useEnterpriseStore } from 'src/stores/enterprise-store.js'
import { useQuasar } from 'quasar'
import { isValidEmail } from 'src/utils/helpers.js'

const email = ref('')
const password = ref('')
const isPwd = ref(true)
const authStore = useAuthStore()
const enterpriseStore = useEnterpriseStore()
const router = useRouter()

const $q = useQuasar()

// Vérification de session existante
onMounted(async () => {
  await authStore.checkSessionAndRedirect()
})

const invalid = computed(() => {
  return !(isValidEmail(email.value) && password.value && password.value.length > 3)
})

// Fonction de connexion
async function handleLogin() {
  if (invalid.value) return

  const { type, message, data } = await authStore.login(email.value, password.value)

  if (type === 'error') {
    $q.notify({
      message,
      type: 'negative'
    })
  } else {
    await redirectBasedOnRole(data.id)
  }
}

// Fonction pour récupérer le rôle et rediriger
async function redirectBasedOnRole(user_id) {
  const { type, message } = await authStore.fetchUserRole(user_id)
  await enterpriseStore.getEnterprise()

  if (type === 'error') {
    $q.notify({
      message,
      type: 'negative'
    })
  } else {
    router.push({ path: '/' })
  }
}
</script>

<style scoped>
@import 'src/css/style.css';
</style>
