<template>
  <div class="mobile-logout-section">
    <q-item clickable v-ripple @click="logout" class="logout-button q-ma-sm">
      <q-item-section avatar>
        <div class="menu-icon-container">
          <q-icon name="power_settings_new" color="red-9" size="19px" class="iconLogout" />
        </div>
      </q-item-section>
      <q-item-section class="text-warning text-weight-medium">
        Déconnexion
      </q-item-section>
    </q-item>
  </div>
</template>

<style scoped>
.mobile-logout-section {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
}
.iconLogout {
  box-shadow: 0 1px 2px #0000000d;
  border-radius: .5rem;
  width: 2rem;
  height: 2rem;
}

.logout-button {
  border-radius: 0.75rem;
  transition: all 0.2s ease;
}

.logout-button:hover {
  background: #fee2e2;
}

.footer-btn i {
  font-size: 1.2rem;
}


@media (max-width: 599px) {

  .mobile-logout-section {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 1rem;
    background: white;
  }
}
</style>


<script setup>
import { useAuthStore } from 'src/stores/auth-store.js'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const authStore = useAuthStore()
const router = useRouter()
const $q = useQuasar()

const logout = async () => {
  const { type, message } = await authStore.logout()

  if (type === 'error') {
    $q.notify({
      type: 'negative',
      message
    })
  } else {
    router.push('/login')
  }
}

</script>
