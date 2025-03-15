<template>
  <q-card flat class="profile-card">
    <div class="profile-actions q-pa-md">
      <q-btn flat no-caps class="full-width q-mb-sm action-btn" to="/me" align="left">
        <q-icon name="person" class="q-mr-sm" />
        Mon Profil
      </q-btn>
      <q-btn flat no-caps class="full-width action-btn" id="logout-button" @click="logout" align="left" color="warning"
        style="padding-left: 7%;">
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
const $q = useQuasar();

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

<style scoped>
.profile-card {
  border-radius: 0.75rem;
}

.profile-actions {
  background: #f8fafc;
}

.action-btn {
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #f1f5f9;
}
</style>
