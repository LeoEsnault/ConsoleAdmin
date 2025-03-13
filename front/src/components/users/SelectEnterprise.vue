<template>
  <div class="bg-grey-2 q-px-xl q-pa-md q-mb-md col-12 items-center"
    :class="$q.screen.lt.md ? '' : 'row q-gutter-x-md'">
    <span class="q-my-auto text-blue" :class="$q.screen.lt.md ? 'q-pb-xs' : 'col-auto'">
      Se connecter à une entreprise :
    </span>

    <q-select v-model="selectedEnterprise" :options="availableEnterprises" @update:model-value="updateUserEnterprise()"
      option-label="name" class="select-input" style="width: 240px" rounded outlined dense />
  </div>
</template>

<script setup>
import { onMounted, ref, computed, defineEmits } from 'vue'
import { useQuasar } from 'quasar'
import { useEnterpriseStore } from 'src/stores/enterprise-store'
import { useUsersStore } from 'src/stores/users-store'
import { getUserFromStorage } from 'src/utils/getUserFromStorage'

const $q = useQuasar()
const enterpriseStore = useEnterpriseStore()
const usersStore = useUsersStore()
const emit = defineEmits(['update'])
const selectedEnterprise = ref(null)

onMounted(async () => {
  try {
    await enterpriseStore.getEnterprises()

    const enterprise = JSON.parse(localStorage.getItem('enterprise'))
    selectedEnterprise.value = enterprise.name || ''
  } catch (error) {
    console.error('Erreur lors de la récupération des données :', error)
    return []
  }
})

const availableEnterprises = computed(() => enterpriseStore.enterprises)

const updateUserEnterprise = async () => {
  const user = getUserFromStorage()

  try {
    const data = {
      profile: {
        enterprise_id: selectedEnterprise.value.id,
      },
    }

    const response = await usersStore.updateUser(user.id, data)

    await enterpriseStore.getEnterprise(user.id)

    emit('update')

    $q.notify({
      type: response?.type,
      message: response?.message,
    })
  } catch (error) {
    console.error("Erreur lors de l'envoi de la demande de réinitialisation :", error)
    $q.notify({
      message: "Une erreur s'est produite. Veuillez réessayer.",
      type: 'negative',
    })
  }
}
</script>

<style lang="scss" scoped>
.select-input :deep(.q-field__control) {
  height: 40px;
}

@media (max-width: 599px) {
  .select-input :deep(.q-field__control) {
    height: 36px;
  }
}
</style>
