<template>
  <q-page class="column flex justify-center">
    <!-- DESKTOP -->
    <div class="desktop-only column q-px-xl q-gutter-y-md">
      <AddUser @click="addUser" />

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
        :max="totalPages" :max-pages="6" boundary-numbers class="self-center q-mt-md"
        @update:model-value="fetchUsers" />
    </div>

    <!-- MOBILE -->
    <div class="mobile-only column content-center q-pa-sm">
      <AddUser @click="addUser" />

      <div class="q-gutter-y-md">
        <div v-if="isLoading" class="q-px-xs">
          <SkeletonRange v-for="n in 3" :key="n" class="q-ma-xs" style="width: 80vw" />
        </div>

        <div v-else v-for="user in users" :key="user.id" class="q-px-md" style="width: 90vw">
          <manage-user :user="user" class="col" />
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
import AddUser from 'src/components/users/AddUser.vue'
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
    users.value = response?.users
    totalPages.value = response?.totalPages
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error)
    return []
  } finally {
    isLoading.value = false
  }
}

const addUser = async (email, callback) => {
  if (!checkEmail(email, $q)) return

  try {
    const data = {
      email: email,
    }
    const addedUser = await usersStore.addUser(data)

    if (!addedUser) return
    if (typeof callback === 'function') {
      callback(true)
    }
    await fetchUsers()
  } catch (error) {
    if (typeof callback === 'function') {
      callback(false)
    }
    console.error(error)
  }
}
</script>
