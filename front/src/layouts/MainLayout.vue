<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import LogoutButton from 'src/components/buttons/LogoutButton.vue'
import MobileLogoutButton from 'src/components/buttons/MobileLogoutButton.vue'
import ProfileButton from 'src/components/buttons/ProfileButton.vue'
import SideMenu from 'src/components/layouts/SideMenu.vue'
import { useProfilStore } from "src/stores/profil-store";
import SelectEnterprise from 'src/components/layouts/SelectEnterprise.vue'

const drawer = ref(true)
const mobileDrawerOpen = ref(false)
const miniState = ref(false)
const $q = useQuasar()
let user = ref(null);
const profilStore = useProfilStore()
const reloadKey = ref(0);
const userName = ref('');

onMounted(() => {
  profilStore.getUserFromStorage()
  user.value = profilStore.user; // TODO : à revoir avec toutes les infos profiles
  fetchUserName()
});

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

const fetchUserName = async () => {
  try {
    const userProfile = await profilStore.fetchUserProfil();

    if (userProfile && userProfile.firstname && userProfile.lastname) {
      userName.value = `${userProfile.firstname} ${userProfile.lastname}`;
    }
  } catch (error) {
    console.error('Erreur récupération nom utilisateur :', error);
  }
};

const refresh = async () => {
  reloadKey.value++;
}
</script>

<template>
  <div>
    <!-- Desktop Layout -->
    <q-layout v-if="$q.screen.gt.sm" view="hHh lpR lFf">
      <q-header class="bg-white text-dark" bordered>

        <q-toolbar class="header-toolbar q-px-lg">
          <section class="header-content">

            <div class="left-section">
              <RouterLink to="/" class="logo-container">
                <q-img loading="lazy" fetchpriority="auto" aria-hidden="true" src="/logo2.jpg"
                  fit="contain" class="enterprise-logo" />
              </RouterLink>

              <SelectEnterprise id="select-enterprise" @update="refresh" />
            </div>

            <!-- Logo Hériade, nom utilisateur et bouton profil -->
            <div class="right-section">
              <q-img src="/logo2.jpg" fit="contain" class="heriade-logo" />
              <div class="user-profile-section">
                <router-link to="/me" class="user-name">
                  {{ userName }}
                </router-link>
                <ProfileButton/>
              </div>
            </div>

          </section>
        </q-toolbar>
      </q-header>

      <!-- Modern Sidebar -->
      <q-drawer v-model="drawer" :mini="miniState" @mouseover="handleMouseOver" @mouseout="handleMouseOut" :width="280"
        :breakpoint="500" bordered class="modern-drawer" :mini-width="70" behavior="desktop" show-if-above>
        <SideMenu />

        <!-- Logout Section -->
        <LogoutButton />
      </q-drawer>

      <q-page-container :key="reloadKey">
        <router-view />
      </q-page-container>
    </q-layout>

    <!-- Mobile Layout -->
    <q-layout v-else view="hHh Lpr fFf">
      <q-header class="bg-white text-dark" bordered>


        <q-toolbar class="mobile-toolbar">
          <!-- <q-btn flat round dense icon="menu" @click="mobileDrawerOpen = true" class="q-mr-sm" /> -->

          <div class="flex items-center">
            <RouterLink to="/" class="logo-container">
              <q-img loading="lazy" fetchpriority="auto" aria-hidden="true" src="assets/heriade_picto_.png"
                fit="contain" class="enterprise-logo" />
            </RouterLink>

            <SelectEnterprise id="select-enterprise" @update="refresh" class="q-pl-md" />
          </div>
          <q-space />

          <!-- Ajout du ProfileButton -->
          <div class="mobile-profile-button">
            <ProfileButton />
          </div>
        </q-toolbar>
      </q-header>


      <!-- Mobile Drawer -->
      <q-drawer v-model="mobileDrawerOpen" side="left" overlay behavior="mobile" :breakpoint="500" class="modern-drawer"
        bordered>
        <SideMenu />

        <!-- Mobile Logout Section -->
        <MobileLogoutButton />
      </q-drawer>

      <!-- Modern Mobile Footer -->
      <q-footer class="modern-footer" bordered>
        <q-toolbar class="justify-around">
          <q-btn dense flat round icon="menu" class="footer-btn" size="md" @click="mobileDrawerOpen = true">
          </q-btn>

          <q-btn dense flat round icon="home" class="footer-btn" size="md" to="/">
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

      <q-page-container :key="reloadKey">
        <router-view />
      </q-page-container>
    </q-layout>
  </div>
</template>

<style scoped>
.user-profile-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-left: 1.5rem;
  border-left: 1px solid rgba(0, 0, 0, 0.1);
}

.header-toolbar {
  height: 70px;
  background: linear-gradient(to right, #ffffff, #f8fafc);
  padding: 0 2rem;
}

.header-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.right-section {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.user-profile-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-left: 1.5rem;
  border-left: 1px solid rgba(0, 0, 0, 0.1);
}

.heriade-logo {
  width: 3rem;
  height: auto;
  transition: transform 0.2s ease;
}

.heriade-logo:hover {
  transform: scale(1.05);
}

.user-name {
  color: var(--q-primary);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.user-name:hover {
  opacity: 0.8;
  transform: translateY(-1px);
  text-decoration: none;
}

.logo-container {
  width: 8rem;
  height: 3rem;
  padding: 0.5rem;
  border-radius: 0.75rem;
  background: white;
  box-shadow: 0 3px 3px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
}

.logo-container:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transform: translateY(-1px);
}

.enterprise-logo {
  height: 100%;
  object-fit: contain;
}


/* Mobile Styles */
.mobile-toolbar {
  height: 60px;
  background: white;
  display: flex;
  align-items: center;
  padding: 0 1rem;
}

.mobile-profile-button {
  margin-left: 0.5rem;
}

.mobile-profile-button :deep(.profile-menu) {
  max-height: 80vh;
  width: 95vw !important;
  margin: 1rem;
}

.modern-footer {
  background: var(--q-primary);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  height: 60px;
}

.footer-btn {
  opacity: 0.8;
  transition: all 0.3s ease;
}

.footer-btn:hover,
.footer-btn:active {
  opacity: 1;
  transform: translateY(-2px);
}

.footer-btn.q-router-link-active {
  opacity: 1;
  transform: translateY(-2px);
}

.footer-btn i {
  font-size: 1.2rem;
}

@media (max-width: 599px) {
  .mobile-toolbar {
    padding: 0 0.5rem;
  }
}

/* Responsive Adjustments */
@media (max-width: 1024px) {
  .header-toolbar {
    height: 60px;
    padding: 0 1rem;
  }

  .logo-container {
    width: 6rem;
    height: 2.5rem;
  }
  
}



/* Dans la section style */
.modern-drawer {
  background: white;
  transition: width 0.3s ease;
}
</style>
