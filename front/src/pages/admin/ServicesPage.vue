<template>
  <q-page class="column flex">
    <!-- Version Desktop -->
    <div v-if="$q.screen.gt.sm" class="column q-px-xl q-py-xl q-gutter-y-md">
      <AddItemInput label="Ajouter un service:" itemType="text"
        buttonText="Vous ne pouvez pas créer un service ayant un nom déjà utilisé." @click="addService" />

      <div class="q-gutter-y-md">
        <div class="row bg-grey-11 q-py-md q-gutter-x-md rounded-borders text-caption">
          <div class="col-1"></div>
          <span class="col-2">Services</span>
          <span class="col-5"></span>
        </div>

        <div v-if="isLoading" class="q-px-xs">
          <SkeletonText v-for="n in 3" :key="n" class="q-ma-xs" />
        </div>

        <div v-else class="q-gutter-y-md">
          <div v-if="enterpriseData?.services.length <= 0">
            Aucun service.
          </div>

          <div v-for="(service, i) of enterpriseData?.services" :key="i" class="row q-gutter-x-md">
            <ManageService id="ManageService" :service="service" @deleteService="fetchEnterprise()" class="col" />
          </div>
        </div>
      </div>
    </div>

    <!-- Version Mobile -->
    <div v-else class="column content-center q-pa-sm q-py-lg">
      <AddItemInput label="Ajouter un service:" itemType="text"
        buttonText="Vous ne pouvez pas créer un service ayant un nom déjà utilisé." @click="addService" />

      <div class="q-gutter-y-md">
        <div v-if="isLoading" class="q-px-xs">
          <SkeletonRange v-for="n in 3" :key="n" class="q-ma-xs" style="width: 80vw" />
        </div>

        <div v-else class="q-gutter-y-md">
          <div v-if="enterpriseData?.services.length <= 0" class="text-grey-7 q-pa-md text-center">
            Aucun établissement.
          </div>

          <div v-else v-for="(service) in enterpriseData?.services" :key="service.id" class="q-px-md"
            style="width: 90vw">
            <ManageService id="ManageService" :service="service" @deleteService="fetchEnterprise()" class="col" />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useEnterpriseStore } from "src/stores/enterprise-store";
import { useServicesStore } from "src/stores/services-store";
import ManageService from "src/components/services/ManageService.vue";
import SkeletonText from 'src/components/skeletons/SkeletonText.vue'
import SkeletonRange from "src/components/skeletons/SkeletonRange.vue";
import AddItemInput from "src/components/card/AddItemInput.vue";


const $q = useQuasar()
const enterpriseStore = useEnterpriseStore()
const isLoading = ref(true)
const servicesStore = useServicesStore()
const enterpriseData = ref(null)
const newService = ref(null);

onMounted(async () => {
  try {
    await fetchEnterprise()
  } finally {
    isLoading.value = false;
  }
});

const fetchEnterprise = async () => {
  enterpriseData.value = await enterpriseStore.getEnterprise()
  console.log('DTA', enterpriseData.value)
}

const addService = async (name, callback) => {
  const data = {
    name
  }

  const response = await servicesStore.addService(data)

  if (!response?.data) {
    if (typeof callback === 'function') {
      callback(false)
    }
  } else {
    enterpriseData.value.services.push(response.data);
    newService.value = "";
    if (typeof callback === 'function') {
      callback(true)
    }
  }

  $q.notify({
    type: response.type,
    message: response.message
  })
}
</script>
