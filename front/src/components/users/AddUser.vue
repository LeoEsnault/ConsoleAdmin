<template>
  <section :class="$q.screen.lt.md ? 'q-pa-md' : 'row justify-start'">
    <div class="col-12 items-center" :class="$q.screen.lt.md ? '' : 'row q-gutter-x-md'">
      <span class="q-my-auto text-blue" :class="$q.screen.lt.md ? 'q-pb-xs' : 'col-auto'">
        Ajouter un utilisateur (email):
      </span>
      <q-input v-model="userEmail" type="email" outlined dense class="desktop-only col-3"></q-input>
      <div :class="$q.screen.lt.md ? 'row items-center' : 'col-auto'">
        <q-input v-model="userEmail" type="email" outlined dense class="mobile-only col q-pr-sm"></q-input>
        <AddButton :text="'Une seule adresse email par utilisateur.'" :disable="!userEmail" @click="addUser" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import AddButton from 'src/components/buttons/AddButton.vue'

const userEmail = ref(null)

const emit = defineEmits(['click'])

const addUser = async () => {
  const success = await new Promise((resolve) => {
    emit('click', userEmail.value, resolve)
  })

  if (success) {
    userEmail.value = ''
  } else {
    console.error("Erreur lors de l'ajout de l'utilisateur.")
  }
}
</script>

<style scoped></style>
