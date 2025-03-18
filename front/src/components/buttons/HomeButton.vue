<template>
    <RouterLink to="/">
    <div class="home-section">
      <q-item clickable v-ripple class="home-button">
        <q-item-section avatar>
          <div class="menu-icon-container">
            <q-icon name="home" size="25px" class="iconHome" />
          </div>
        </q-item-section>
        <q-item-section style="color: black; padding-left: 5%;">
         Accueil
        </q-item-section>
      </q-item>
    </div>
    </RouterLink>   
  </template>
  
  <style scoped>
  .home-section {
    position: absolute;
    padding: 1rem;
    width: 100%;
  }
  
  .iconHome {
    box-shadow: 0 1px 2px #0000000d;
    border-radius: .5rem;
    width: 2rem;
    height: 2rem;
    color: var(--q-primary); ;
  }
  
  .home-button {
    border-radius: 0.75rem;
    transition: all 0.2s ease;
  }
  
  </style>
  
  <script setup>
import { RouterLink } from 'vue-router';

  </script>
  