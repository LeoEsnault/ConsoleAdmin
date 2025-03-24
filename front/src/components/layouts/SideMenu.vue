<template>
  <q-scroll-area class="fit">
    <q-list padding class="menu-list">
      <template v-for="(menuItem, index) in menuList" :key="index">
        <div class="menu-item-container">
          <q-item clickable v-ripple class="menu-item" :class="{ 'menu-item-active': isActiveRoute(menuItem.link) }"
            @click="menuItem.subMenu ? toggleSubMenu(index) : onMenuClick(menuItem)">
            <q-item-section avatar>
              <div class="menu-icon-container">
                <i :class="menuItem.icon" class="menu-icon"></i>
              </div>
            </q-item-section>

            <q-item-section>
              <span class="menu-label">{{ menuItem.label }}</span>
            </q-item-section>

            <q-item-section v-if="menuItem.subMenu" side>
              <i class="fa-solid fa-chevron-down text-grey-6 transition-transform"
                :class="{ 'rotate-180': isMenuOpen(index) }">
              </i>
            </q-item-section>
          </q-item>

          <!-- Sous-menu avec transition -->
          <q-slide-transition>
            <div v-if="menuItem.subMenu && isMenuOpen(index)" id="submenu" class="submenu" ref="submenu">
              <q-item v-for="subItem in menuItem.subMenu" :key="subItem.link || subItem.label" :to="subItem.link"
                clickable v-ripple class="submenu-item" :class="{ 'submenu-item-active': isActiveRoute(subItem.link) }">
                <q-item-section avatar>
                  <div class="submenu-icon-container">
                    <i :class="subItem.icon" class="submenu-icon"></i>
                  </div>
                </q-item-section>

                <q-item-section>
                  <span class="submenu-label">{{ subItem.label }}</span>
                </q-item-section>
              </q-item>
            </div>
          </q-slide-transition>
        </div>

        <q-separator v-if="menuItem.separator" :key="'sep' + index" class="menu-separator" />
      </template>
    </q-list>
  </q-scroll-area>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from "vue-router";

const refreshKey = ref(0);
const route = useRoute();
const router = useRouter();
const isActiveRoute = (link) => {
  return route.path === link;
};

const menuList = [
  {
    icon: "fa-solid fa-house",
    label: "Accueil",
    link: "/",
    separator: true,
  },
  {
    icon: "fa-solid fa-suitcase",
    label: "Administration",
    link: "/admin/enterprise",
    separator: true,
    adminOnly: true,
    subMenu: [
      {
        icon: "fa-solid fa-building",
        label: "Établissements",
        link: "/admin/establishments",
      },
      {
        icon: "fa-solid fa-briefcase",
        label: "Services",
        link: "/admin/services",
      },
    ],
  },

];

const onMenuClick = (item) => {

  router.push(item.link);
  if (router.currentRoute.value.path === item.link) {
    refreshKey.value += 1;
  }
};

const openMenus = ref([]);

const toggleSubMenu = (menuIndex) => {
  const index = openMenus.value.indexOf(menuIndex);
  if (index === -1) {
    openMenus.value.push(menuIndex);
  } else {
    openMenus.value.splice(index, 1);
  }
};

const isMenuOpen = (menuIndex) => {
  return openMenus.value.includes(menuIndex);
};
</script>

<style scoped>
.menu-list {
  padding: 1rem;
}

.menu-item {
  border-radius: 0.75rem;
  margin: 0.25rem 0;
  transition: all 0.2s ease;
}

.menu-item:hover {
  background: #f8fafc;
}

.menu-item-active {
  background: #f1f5f9;
  font-weight: 600;
}

.menu-icon-container {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  background: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  position: relative;
}

.menu-icon {
  font-size: 1rem;
  color: var(--q-primary);
}

.menu-separator {
  margin: 0.5rem 0;
  opacity: 0.1;
}

.submenu {
  padding-left: 1.5rem;
  background: #f8fafc;
  border-left: 2px solid var(--q-primary);
  margin: 0.25rem 0;
}

.submenu-item {
  border-radius: 0.5rem;
  margin: 0.25rem 0;
  padding: 0.5rem 1rem;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.submenu-item:hover {
  background: #f1f5f9;
}

.submenu-item-active {
  background: #e2e8f0;
  font-weight: 500;
}

.submenu-icon-container {
  width: 1.75rem;
  height: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.4rem;
  background: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.submenu-icon {
  font-size: 0.875rem;
  color: var(--q-primary);
}

.submenu-label {
  font-size: 0.875rem;
  white-space: nowrap;
}

/* Animation du chevron */
.transition-transform {
  transition: transform 0.3s ease;
}

.rotate-180 {
  transform: rotate(180deg);
}

/* Dans la section style */
.modern-drawer {
  transition: width 0.3s ease;
}

/* Style pour le mode mini */
.q-drawer--mini .menu-label,
.q-drawer--mini .submenu {
  display: none;
}

.q-drawer--mini .menu-icon-container {
  margin: 0 auto;
}

.q-drawer--mini .menu-item {
  padding: 0.5rem;
  justify-content: center;
}

/* Animation pour les éléments du menu */
.menu-item {
  transition: all 0.3s ease;
}

.menu-label {
  transition: opacity 0.3s ease;
}
</style>
