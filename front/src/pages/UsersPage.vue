<template>
  <q-page class="flex justify-center q-px-xl column q-gutter-y-md desktop-only">
    <section class="row justify-start">
      <!-- <div class="col-12 row items-center q-gutter-x-md">
        <span class="col-auto q-my-auto text-blue">Ajouter un utilisateur (email):</span>
        <q-input v-model="userEmail" type="email" outlined dense class="col-3"></q-input>
        <div class="col-auto">
          <q-btn
            icon="add"
            round
            size="sm"
            color="secondary"
            @click="addUser"
            :disable="!userEmail"
          >
            <q-tooltip>Une seule adresse email par utilisateur.</q-tooltip>
          </q-btn>
        </div>
      </div> -->
    </section>

    <div class="q-gutter-y-md">
      <div class="bg-grey-11 row q-py-md q-px-md rounded-borders text-caption">
        <span class="col title">Email</span>
        <span class="col title">Nom</span>
        <span class="col title">Prénom</span>
        <div class="col"></div>
      </div>

      <div v-if="isLoading" class="q-px-xs">
        <SkeletonText v-for="n in 3" :key="n" class="q-ma-xs" />
      </div>

      <div v-else v-for="user in users" :key="user.id" class="q-px-md">
        <manage-user :user="user" class="col" />
      </div>
    </div>
    <q-pagination ref="pagination" v-if="totalPages > 1 && !isLoading" v-model="currentPage" color="primary"
      :max="totalPages" :max-pages="6" boundary-numbers class="self-center q-mt-md" @update:model-value="fetchUsers" />
  </q-page>

  <q-page class="column flex justify-center content-center mobile-only q-pa-sm">
    <div class="q-gutter-y-md">
      <div v-if="isLoading" class="q-px-xs">
        <SkeletonRange v-for="n in 3" :key="n" class="q-ma-xs" style="width:80vw" />
      </div>

      <div v-else v-for="user in users" :key="user.id" class="q-px-md" style="width:90vw">
        <manage-user :user="user" class="col" />
      </div>

    </div>
    <q-pagination ref="pagination" v-if="totalPages > 1 && !isLoading" v-model="currentPage" color="primary"
      :max="totalPages" :max-pages="6" boundary-numbers class="self-center q-mt-md" @update:model-value="fetchUsers" />
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useUsersStore } from 'src/stores/users-store.js'
import ManageUser from 'src/components/users/manage-user.vue'
import SkeletonText from 'src/components/skeletons/SkeletonText.vue'
import SkeletonRange from 'src/components/skeletons/SkeletonRange.vue'

const isLoading = ref(true)
const users = ref([])
const usersStore = useUsersStore()
let currentPage = ref(1)
let usersPerPage = 10
const totalPages = ref(10)

//const userEmail = ref(null)

onMounted(async () => {
  await fetchUsers()
})

const fetchUsers = async () => {
  isLoading.value = true

  try {
    const response = await usersStore.getUsers(currentPage.value, usersPerPage)
    users.value = response?.users
    totalPages.value = response?.totalPages
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error)
    return []
  } finally {
    isLoading.value = false
  }
}
</script>
