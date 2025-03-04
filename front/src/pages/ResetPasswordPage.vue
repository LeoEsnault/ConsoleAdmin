<template>
  <q-layout view="lHh Lpr lFf" class="bg-image">
    <q-page-container>
      <q-page class="flex justify-center items-center">
        <div style="width: 100%; max-width: 500px; height: 100%" class="q-mb-xl">
          <q-img
            src="/assets/LogoHeriadeCouleur.png"
            fit="contain"
            style="height: 7rem; z-index: 50"
            class="q-mt-lg"
            @keyup.enter="updatePassword"
          ></q-img>
          <q-form
            class="bg-white rounded-borders q-pa-lg q-ma-sm q-my-xl"
            style="box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1)"
          >
            <h1 class="text-h5 text-center" style="color: #263286 !important;">Mettre à jour le mot de passe</h1>

            <div class="q-pb-md">
              <p class="text-purple q-mb-sm">Nouveau mot de passe</p>
              <q-input
                outlined
                dense
                :type="isPwd ? 'password' : 'text'"
                v-model="newPassword"
                required
                :rules="[
                  (val) => (val && val.length > 5) || 'Le mot de passe doit contenir au moins 6 caractères.'
                ]"
                class="q-mb-lg"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    size="sm"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
            </div>

            <div class="q-pb-md" id="secondInputPassword">
              <p class="text-purple q-mb-sm">Confirmer le mot de passe</p>
              <q-input
                outlined
                dense
                :type="isPwd ? 'password' : 'text'"
                v-model="confirmPassword"
                required
                :rules="[
                  (val) => (val === newPassword) || 'Les mots de passe ne correspondent pas.'
                ]"
                class="q-mb-lg"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    size="sm"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
            </div>

            <div class="flex flex-center q-pt-lg">
              <q-btn id="h__update_password_btn" @click="updatePassword" :disable="invalid" label="Envoyer" :loading="authStore.loading" no-caps
                     padding="sm xl"
                     class="modern-primary-btn">
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
import { useAuthStore } from 'src/stores/auth-store.js'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'


const confirmPassword = ref('')
const isPwd = ref(true)
const newPassword = ref(null)
const authStore = useAuthStore()
const router = useRouter()

const $q = useQuasar()

const invalid = computed(() => {
  return !(newPassword.value && newPassword.value === confirmPassword.value && newPassword.value.length > 5)
})
const updatePassword = async () => {
  if (invalid.value) {
    return
  }
  const { type, message } = await authStore.updatePassword(newPassword.value)
  console.log(type)
  if (type === 'error') {
    $q.notify({
      type: 'negative',
      message
    })
  } else {
    $q.notify({
      type: 'positive',
      message
    })
    await router.push('/login')
  }
}

onMounted(() => {
  authStore.handleToken()
})
</script>

<style scoped>
@import 'src/css/style.css';
</style>
