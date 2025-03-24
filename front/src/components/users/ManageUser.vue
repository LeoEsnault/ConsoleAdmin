<template>
  <div>
    <div class="desktop-only row items-center q-gutter-x-md">
      <div class="col">
        <div v-if="!isEditingUser" id="userEmail">{{ userEmail }}</div>
        <q-input v-else ref="userEmailInput" v-model="userEmail" type="email" rounded outlined dense
          class="text-caption"></q-input>
      </div>

      <div class="col">
        <div v-if="!isEditingUser" id="userLastname">{{ userLastname }}</div>
        <q-input v-else ref="userLastnameInput" v-model="userLastname" type="text" outlined rounded dense
          class="text-caption"></q-input>
      </div>

      <div class="col">
        <div v-if="!isEditingUser" id="userFirstname">{{ userFirstname }}</div>
        <q-input v-else ref="userFirstnameInput" class="text-caption" v-model="userFirstname" type="text" rounded
          outlined dense></q-input>
      </div>

      <div class="col text-center">
        <EditButtons :isEditing="isEditingUser" :isUpdated="isUpdated" @save="save" @cancel="reset" @edit="editUser"
          @delete="showDeleteConfirm = true" />
      </div>
    </div>

    <div class="mobile-only col col-12" style="max-width: 50rem">
      <q-list bordered class="rounded-borders">
        <q-expansion-item expand-separator>
          <template v-slot:header>
            <q-item-section id="userEmail-mobile">
              {{ userEmail }}
            </q-item-section>
          </template>
          <q-card>
            <q-card-section class="bg-grey-11 row items-center flex justify-between">
              <div>
                <div class="col-1 row">
                  <div id="userLastname-mobile" class="q-mr-xs">{{ userLastname }}</div>
                  <div id="userFirstname-mobile">{{ userFirstname }}</div>
                </div>
              </div>

              <div>
                <div>
                  <q-btn id="edit-user-button-mobile" icon="edit" round size="sm" flat color="secondary"
                    @click="openPopup()"></q-btn>
                  <q-btn id="delete-button-mobile" icon="delete" round size="sm" flat color="primary"
                    @click="showDeleteConfirm = true"></q-btn>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>
    </div>

    <q-dialog v-model="popUp" persistent>
      <q-card class="q-px-xl">
        <q-card-section>
          <h3 class="text-subtitle2 text-weight-bold text-purple text-center">Edition</h3>
          <div style="margin-bottom: 5px">
            <p style="margin-bottom: 0">Adresse Mail</p>
            <q-input id="userEmailInput-mobile" v-model="userEmail" type="email" rounded outlined dense
              class="text-caption"></q-input>
          </div>
          <div style="margin-bottom: 5px">
            <p style="margin-bottom: 0">Nom</p>
            <q-input id="userLastnameInput-mobile" v-model="userLastname" type="text" outlined rounded dense
              class="text-caption"></q-input>
          </div>
          <div style="margin-bottom: 5px">
            <p style="margin-bottom: 0">Prénom</p>
            <q-input id="userFirstnameInput-mobile" class="text-caption" v-model="userFirstname" type="text" rounded
              outlined dense></q-input>
          </div>
          <div class="text-center">
            <q-btn id="save-user" icon="check" round size="md" flat color="secondary" :disable="!isUpdated"
              @click="save"></q-btn>
            <q-btn id="cancel-update" icon="cancel" round size="md" flat color="cancel" @click="reset"></q-btn>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <PopUpCardWrapper v-model="showDeleteConfirm" :title="'Confirmation'"
      :text="'Êtes-vous sûr de vouloir supprimer cet utilisateur ?'" :loading="usersStore.loading" @confirm="deleteUser"
      @update:popUp="showDeleteConfirm = false" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, defineEmits } from 'vue'
import { useUsersStore } from 'src/stores/users-store.js'
import { useQuasar } from 'quasar'
import { checkEmail } from 'src/utils/helpers'
import PopUpCardWrapper from 'src/components/card/PopUpCardWrapper.vue'
import EditButtons from "../buttons/EditButtons.vue";


const $q = useQuasar()
const emit = defineEmits(['deleteUser'])
const props = defineProps(['user'])
const usersStore = useUsersStore()

const userEmail = ref(null)
const userLastname = ref(null)
const userFirstname = ref(null)
const oUserEmail = ref(null)
const oUserLastname = ref(null)
const oUserFirstname = ref(null)
const isEditingUser = ref(false)
const popUp = ref(false)
const showDeleteConfirm = ref(false)

onMounted(async () => {
  userEmail.value = props.user.email
  userLastname.value = props.user?.profile?.lastname
  userFirstname.value = props.user?.profile?.firstname

  oUserEmail.value = userEmail.value
  oUserLastname.value = userLastname.value
  oUserFirstname.value = userFirstname.value
})

const openPopup = () => {
  editUser()
  popUp.value = true
}

const editUser = () => {
  isEditingUser.value = true
}

const isUpdated = computed(() => {
  return (
    userEmail.value != oUserEmail.value ||
    userLastname.value != oUserLastname.value ||
    userFirstname.value != oUserFirstname.value
  )
})

const reset = () => {
  userEmail.value = oUserEmail.value
  userLastname.value = oUserLastname.value
  userFirstname.value = oUserFirstname.value
  isEditingUser.value = false
  popUp.value = false
}

const save = async () => {
  if (!checkEmail(userEmail.value, $q)) return

  const data = {
    email: userEmail.value,
    profile: {
      lastname: userLastname.value,
      firstname: userFirstname.value,
    },
  }

  const response = await usersStore.updateUser(props.user.id, data)
  $q.notify({
    type: response?.type,
    message: response?.message
  })

  if (!response?.data) return

  oUserEmail.value = userEmail.value
  oUserLastname.value = userLastname.value
  oUserFirstname.value = userFirstname.value

  isEditingUser.value = false
  popUp.value = false
}

const deleteUser = async () => {
  const response = await usersStore.deleteUser(props.user.id)

  if (response?.type === "positive") {
    emit('deleteUser')
  }

  $q.notify({
    type: response?.type,
    message: response?.message
  })
}
</script>
