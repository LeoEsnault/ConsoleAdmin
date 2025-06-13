<template>
  <q-page class="column flex">
    <!-- ORDINATEUR DE BUREAU -->
    <div v-if="$q.screen.gt.sm" class="column q-px-xl q-py-xl q-gutter-y-md">
      <div class="q-gutter-y-md">
        <div class="bg-grey-11 row q-py-md q-px-md rounded-borders text-caption">
          <span class="col title" style="padding: 0 8vw 0 0;">Email</span>
          <span class="col title" style="padding: 0 10vw 0 0;">Nom</span>
          <span class="col title">Prénom</span>
          <div class="col"></div>
        </div>

        <div v-if="isLoading" class="q-px-xs">
          <SkeletonText v-for="n in 3" :key="n" class="q-ma-xs" />
        </div>

        <div v-else class="q-gutter-y-md">
          <div v-if="users.length <= 0" class="text-grey-7 q-pa-md text-center">
            Aucun utilisateur.
          </div>

          <div v-else v-for="user in users" :key="user.id" class="q-px-md">
            <div v-if="user" class="row items-center q-gutter-x-md">
              <div class="col">{{ user.email }}</div>
              <div class="col">{{ user.lastname }}</div>
              <div class="col">{{ user.firstname }}</div>
            </div>
          </div>
        </div>
      </div>
      <q-pagination ref="pagination" v-if="totalPages > 1 && !isLoading" v-model="currentPage" color="primary"
        :max="totalPages" :max-pages="6" boundary-numbers class="self-center q-mt-md"
        @update:model-value="fetchUsers" />
    </div>

    <!-- MOBILE -->
    <div v-else class="column content-center q-pa-sm q-py-lg">
      <div class="q-gutter-y-md">
        <div v-if="isLoading" class="q-px-xs">
          <SkeletonRange v-for="n in 3" :key="n" class="q-ma-xs" style="width: 80vw" />
        </div>

        <div v-else class="q-gutter-y-md">
          <div v-if="users.length <= 0" class="text-grey-7 q-pa-md text-center">
            Aucun utilisateur.
          </div>

          <div v-else v-for="user in users" :key="user.id" class="q-px-md text-center" style="width: 90vw;">
            <div v-if="user" class="column items-center q-gutter-y-sm">
              <div style="display: flex;"><div style="font-weight: bold; padding: 0 1em 0 0;">Email: </div>{{ user.email }}</div>
              <div style="display: flex;"><div style="font-weight: bold; padding: 0 1em 0 0;">Nom: </div>{{ user.lastname }}</div>
              <div style="display: flex;"><div style="font-weight: bold; padding: 0 1em 0 0;">Prénom: </div> {{ user.firstname }}</div>
              <span style="width: 50vw; height: 0.5px; border: solid gray;"></span>
            </div>
          </div>
        </div>
      </div>
      <q-pagination ref="pagination" v-if="totalPages > 1 && !isLoading" v-model="currentPage" color="primary"
        :max="totalPages" :max-pages="6" boundary-numbers class="self-center q-mt-md" @update:modelValue="fetchUsers" />
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useUsersStore } from 'src/stores/users-store.js'
import SkeletonText from 'src/components/skeletons/SkeletonText.vue'
import SkeletonRange from 'src/components/skeletons/SkeletonRange.vue'

const $q = useQuasar()
const isLoading = ref(true)
const users = ref([])
const usersStore = useUsersStore()

let currentPage = ref(1)
let usersPerPage = 10
const totalPages = ref(10)

onMounted(async () => {
  await fetchUsers()
})

const fetchUsers = async () => {
  isLoading.value = true
  try {
    const response = await usersStore.getUsers(currentPage.value, usersPerPage)
    console.log('Données récupérées:', response)
    users.value = response?.users || []
    totalPages.value = response?.totalPages || 1
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error)
    $q.notify({
      type: 'negative',
      message: 'Erreur lors de la récupération des utilisateurs.'
    })
  } finally {
    isLoading.value = false
  }
}

// const refresh = async () => {
//   currentPage.value = 1
//   fetchUsers()
// }
</script>
