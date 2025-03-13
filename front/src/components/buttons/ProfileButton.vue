<script setup>
import ProfileButtonMenu from './ProfileButtonMenu.vue';
</script>

<template>
  <div class="profile-button">
    <q-btn round flat class="profile-btn">
      <q-avatar size="40px" class="shadow-1">
        <q-icon name="person" class="icon-color"/>
      </q-avatar>
      <q-menu transition-show="jump-down" transition-hide="jump-up" :offset="[0, 15]" class="profile-menu" anchor="bottom end" self="top end">
        <ProfileButtonMenu />
      </q-menu>
    </q-btn>
  </div>
</template>

<style scoped>
.icon-color {
  color: var(--q-primary);
}

.profile-button {
  position: absolute;
  top: 1vh;
  right: 0;
  margin-right: 16px; 
}

.profile-btn {
  transition: transform 0.2s ease;
}

.profile-btn:hover {
  transform: translateY(-1px);
}

.default-avatar {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  color: var(--q-primary);
}

.profile-menu {
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.profile-card {
  border-radius: 0.75rem;
}

.profile-actions {
  background: #f8fafc;
}

.action-btn {
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  padding: 0.5rem;
}

.action-btn:hover {
  background: #f1f5f9;
}
</style>
