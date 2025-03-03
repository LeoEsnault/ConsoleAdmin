<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import LogoutButton from 'src/components/buttons/LogoutButton.vue'
import MobileLogoutButton from 'src/components/buttons/MobileLogoutButton.vue'

const drawer = ref(true)
const mobileDrawerOpen = ref(false)
const miniState = ref(false)
const $q = useQuasar()

const handleMouseOver = () => {
  if (drawer.value) {
    miniState.value = false
  }
}

const handleMouseOut = () => {
  if (drawer.value) {
    miniState.value = true
  }
}
</script>

<template>
  <div>
    <!-- Desktop Layout -->
    <q-layout v-if="$q.screen.gt.sm" view="hHh lpR lFf">


      <!-- Modern Sidebar -->
      <q-drawer v-model="drawer" :mini="miniState" @mouseover="handleMouseOver" @mouseout="handleMouseOut" :width="280"
                :breakpoint="500" bordered class="modern-drawer" :mini-width="70" behavior="desktop" show-if-above>
        <!-- Logout Section -->

        <LogoutButton />
      </q-drawer>

      <q-page-container>
        <router-view :key="refreshKey" />
      </q-page-container>
    </q-layout>

    <!-- Mobile Layout -->
    <q-layout v-else view="hHh Lpr fFf">


      <!-- Mobile Drawer -->
      <q-drawer v-model="mobileDrawerOpen" side="left" overlay behavior="mobile" :breakpoint="500" class="modern-drawer"
                bordered>

        <!-- Mobile Logout Section -->
        <MobileLogoutButton />
      </q-drawer>

      <!-- Modern Mobile Footer -->
      <q-footer class="modern-footer" bordered>
        <q-toolbar class="justify-around">
          <q-btn dense flat round icon="menu" class="footer-btn" size="md" @click="mobileDrawerOpen = true">
            <i class="fa-solid fa-bars text-white"></i>
          </q-btn>

          <q-btn dense flat round class="footer-btn" size="lg">
            <i class="fa-solid fa-suitcase text-white"></i>
          </q-btn>

          <q-btn to="/forms" dense flat round class="footer-btn" size="lg">
            <i class="fa-regular fa-rectangle-list text-white"></i>
          </q-btn>

          <q-btn to="/" dense flat round class="footer-btn" size="lg">
            <i class="fa-solid fa-house text-white"></i>
          </q-btn>
        </q-toolbar>
      </q-footer>
    </q-layout>
  </div>
</template>

<style scoped>


.modern-footer {
  background: white;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  height: 60px;
}

.footer-btn:hover,
.footer-btn:active {
  opacity: 1;
  transform: translateY(-2px);
}

.footer-btn i {
  font-size: 1.2rem;
}

.modern-footer {
  background: var(--q-primary);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  height: 60px;
}

</style>
