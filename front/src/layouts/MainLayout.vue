<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import LogoutButton from 'src/components/buttons/LogoutButton.vue'
import MobileLogoutButton from 'src/components/buttons/MobileLogoutButton.vue'
import ProfileButton from 'src/components/buttons/ProfileButton.vue'
import HomeButton from 'src/components/buttons/HomeButton.vue'

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
      <q-header class="header-toolbar" bordered>
        <div class="logo-container">
        <RouterLink to="/">
        <q-img class="heriade-logo" 
        loading="lazy" fetchpriority="auto" aria-hidden="true" draggable="false"
         src="assets/heriade_picto_.png" 
         fit="contain">
        </q-img>
      </RouterLink>
       </div>
        <q-text style="color: black;" class="heriade">Heriade</q-text>
          <section class="header-content">
            <div class="left-section">
              <RouterLink to="/">
              </RouterLink>
            </div>
              <div class="user-profile-section">
                <ProfileButton />
            </div>
          </section>
      </q-header>
      <q-page-container>
        <router-view />
      </q-page-container>
      <!-- Modern Sidebar -->
      <q-drawer v-model="drawer" :mini="miniState" @mouseover="handleMouseOver" @mouseout="handleMouseOut" :width="280"
                :breakpoint="500" bordered class="modern-drawer" :mini-width="70" behavior="desktop" show-if-above>
        <HomeButton/>
        <!-- Logout Section -->
        <LogoutButton />
      </q-drawer>
    </q-layout>

    <!-- Mobile Layout -->
    <q-layout v-else view="hHh Lpr fFf">
      <q-header class="header-toolbar" bordered>
        <RouterLink class="heriade-logo"  to="/">
        <q-img 
        loading="lazy" fetchpriority="auto" aria-hidden="true" draggable="false"
         src="public/assets/heriade_picto_.png" 
         fit="contain">
        </q-img>
      </RouterLink>
        <q-text style="color: black;" class="heriade">Heriade</q-text>
          <section class="header-content">
            <div class="left-section">
              <RouterLink to="/">
              </RouterLink>
            </div>
              <div class="user-profile-section">
                <ProfileButton />
            </div>
          </section>
      </q-header>

      <q-page-container>
        <router-view />
      </q-page-container>


      <!-- Mobile Drawer -->
      <q-drawer v-model="mobileDrawerOpen" side="left" overlay behavior="mobile" :breakpoint="500" class="modern-drawer"
                bordered>
        <HomeButton/>
        <!-- Mobile Logout Section -->
        <MobileLogoutButton />
      </q-drawer>

      <!-- Modern Mobile Footer -->
      <q-footer class="modern-footer">
        <q-toolbar class="footer-btn-container">
          <q-btn dense flat round icon="menu" class="footer-btn" size="md" @click="mobileDrawerOpen = true">
            <i class="fa-solid fa-bars text-white"></i>
          </q-btn>

          <q-btn dense flat round icon="home" class="footer-btn-home" size="md" to="/">
            <i class="fa-solid fa-suitcase text-white"></i>
          </q-btn>
          <!--  En commentaire pour faire plus propre en attendant le lien avec l'app.heriade
            
          <q-btn to="/forms" dense flat round class="footer-btn" size="lg">
            <i class="fa-regular fa-rectangle-list text-white"></i>
          </q-btn>

          <q-btn to="/" dense flat round class="footer-btn" size="lg">
            <i class="fa-solid fa-house text-white"></i>
          </q-btn> -->
        </q-toolbar>
      </q-footer>
    </q-layout>
  </div>
</template>

<style scoped>
.heriade{
 margin-top: 2.5vh;
 margin-left: 14.5%;
 font-size: 15px;
}
.user-profile-section{
  width: 100%;
}
.header-toolbar {
  height: 70px;
  background: #f1f5f9;;
  padding: 0 1rem;
  display: flex;
  flex-direction: row;
}
.heriade-logo {
  width: 2.5rem;
  height: auto;
  transition: transform 0.2s ease;
  margin-top: -0.5vh;
  margin-left: 30%;
}
.heriade-logo:hover {
  transform: scale(1.05);
}
.logo-container {
  width: 8rem;
  height: 3rem;
  padding: 0.5rem;
  border-radius: 0.75rem;
  background: white;
  box-shadow: 0 3px 3px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
  position: absolute;
  margin-top: 1vh;
}
.modern-footer {
  background: white;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  height: 60px;
  width: 100%;
}
.footer-btn-container{
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
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
@media (max-width: 1024px) {
  .header-toolbar {
    height: 60px;
    padding: 0 1rem;
  }

  .logo-container {
    width: 6rem;
    height: 2.5rem;
    position: absolute;
  }
  .heriade-logo {
  width: 2.5rem;
  height: auto;
  transition: transform 0.2s ease;
  margin-top: 1vh;
  margin-left: 0%;
}
.heriade{
 margin-top: 2.5vh;
 margin-left: 2%;
 font-size: small;
}
}

</style>
