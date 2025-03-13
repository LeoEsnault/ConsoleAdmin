<template>
<q-card flat class="profile-card">
    <div class="profile-actions q-pa-md">
      <q-btn flat no-caps class="full-width q-mb-sm action-btn" to="/me">
        <q-icon name="person" class="q-mr-sm"/>
        Mon Profil
      </q-btn>
      <q-btn flat no-caps class="full-width action-btn" id="logout-button" @click="logout" color="red-9" style="padding-left: 7%;">
        <q-icon name="logout" class="q-mr-sm" />
        Déconnexion
      </q-btn>
    </div>
  </q-card>
  </template>
 <script setup>
 import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/auth-store";
import { useQuasar } from "quasar";

const router = useRouter();
const authStore = useAuthStore();
const $q =useQuasar();

const logout = async () => {
  const { type, message } = await authStore.logout();

  if (type === 'error') {
    $q.notify({
      type: 'negative',
      message
    });
  } else {
    router.push('/login');
  }
};
 </script>
