<template>
  <q-page class="column flex">
    <!-- DESKTOP -->
    <div v-if="$q.screen.gt.sm" class="column q-px-xl q-py-xl q-gutter-y-md">
      <AddItemInput label="Ajouter un utilisateur (email):" itemType="email"
        buttonText="Une seule adresse email par utilisateur." @click="addUser" />
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

        <div v-else class="q-gutter-y-md">
          <div v-if="users.length <= 0" class="text-grey-7 q-pa-md text-center">
            Aucun utilisateur.
          </div>

          <div v-else v-for="user in users" :key="user.id" class="q-px-md">
            <ManageUser :user="user" class="col" @deleteUser="refresh()" />
          </div>
        </div>
      </div>
      <q-pagination ref="pagination" v-if="totalPages > 1 && !isLoading" v-model="currentPage" color="primary"
        :max="totalPages" :max-pages="6" boundary-numbers class="self-center q-mt-md"
        @update:model-value="fetchUsers" />
    </div>

    <!-- MOBILE -->
    <div v-else class="column content-center q-pa-sm q-py-lg">
      <AddItemInput label="Ajouter un utilisateur (email):" itemType="email"
        buttonText="Une seule adresse email par utilisateur." @click="addUser" />

      <div class="q-gutter-y-md">
        <div v-if="isLoading" class="q-px-xs">
          <SkeletonRange v-for="n in 3" :key="n" class="q-ma-xs" style="width: 80vw" />
        </div>

        <div v-else class="q-gutter-y-md">
          <div v-if="users.length <= 0" class="text-grey-7 q-pa-md text-center">
            Aucun utilisateur.
          </div>

          <div v-else v-for="user in users" :key="user.id" class="q-px-md" style="width: 90vw">
            <ManageUser :user="user" class="col" @deleteUser="refresh()" />
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
import ManageUser from 'src/components/users/ManageUser.vue'
import AddItemInput from 'src/components/card/AddItemInput.vue'
import SkeletonText from 'src/components/skeletons/SkeletonText.vue'
import SkeletonRange from 'src/components/skeletons/SkeletonRange.vue'
import { checkEmail } from 'src/utils/helpers'

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
    users.value = response?.users || {}
    totalPages.value = response?.totalPages || null
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error)
    return []
  } finally {
    isLoading.value = false
  }
}

const addUser = async (email, callback) => {
  if (!checkEmail(email, $q)) return

  const data = {
    email: email,
  }
  const response = await usersStore.addUser(data)

  if (!response?.data) {
    if (typeof callback === 'function') {
      callback(false)
    }
  } else {
    if (typeof callback === 'function') {
      callback(true)
    }
    currentPage.value = 1
    await fetchUsers()
  }

  $q.notify({
    type: response.type,
    message: response.message
  })
}

const refresh = async () => {
  currentPage.value = 1
  fetchUsers()
}
</script>
