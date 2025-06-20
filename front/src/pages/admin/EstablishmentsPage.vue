<template>
  <q-page class="column flex ">
    <!-- Version Desktop -->
    <div v-if="$q.screen.gt.sm" class="column q-px-xl q-py-xl q-gutter-y-md">
      <AddItemInput label="Ajouter un établissement:" itemType="text"
        buttonText="Vous ne pouvez pas créer un établissement ayant un nom déjà utilisé." @click="addEstablishment" />

      <div class="q-gutter-y-md">
        <div class="bg-grey-11 row q-py-md q-px-md rounded-borders text-caption">
          <div class="col-1"></div>
          <span class="col-2">Établissements</span>
          <div class="col-5"></div>
        </div>

        <div v-if="isLoading" class="q-px-xs">
          <SkeletonText v-for="n in 3" :key="n" class="q-ma-xs" />
        </div>

        <div v-else class="q-gutter-y-md">
          <div v-if="enterpriseData?.establishments.length <= 0" class="text-grey-7 q-pa-md text-center">
            Aucun établissement.
          </div>

          <div v-else v-for="(establishment) in enterpriseData?.establishments" :key="establishment.id" class="q-px-md">
            <ManageEstablishment id="ManageEstablishment" :establishment="establishment"
              @deleteEstablishment="fetchEnterprise()" class="col" />
          </div>
        </div>
      </div>
    </div>

    <!-- Version Mobile -->
    <div v-else class="column content-center q-pa-sm q-py-lg">
      <AddItemInput label="Ajouter un établissement:" itemType="text"
        buttonText="Vous ne pouvez pas créer un établissement ayant un nom déjà utilisé." @click="addEstablishment" />

      <div class="q-gutter-y-md">
        <div v-if="isLoading" class="q-px-xs">
          <SkeletonRange v-for="n in 3" :key="n" class="q-ma-xs" style="width: 80vw" />
        </div>

        <div v-else class="q-gutter-y-md">
          <div v-if="enterpriseData?.establishments.length <= 0" class="text-grey-7 q-pa-md text-center">
            Aucun établissement.
          </div>

          <div v-else v-for="(establishment) in enterpriseData?.establishments" :key="establishment.id" class="q-px-md"
            style="width: 90vw">
            <ManageEstablishment :establishment="establishment" @deleteEstablishment="fetchEnterprise()" class="col" />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQuasar } from 'quasar';
import { useEstablishmentsStore } from "src/stores/establishments-store";
import ManageEstablishment from "src/components/establishments/ManageEstablishment.vue";
import { useEnterpriseStore } from "src/stores/enterprise-store";
import SkeletonText from 'src/components/skeletons/SkeletonText.vue'
import SkeletonRange from "src/components/skeletons/SkeletonRange.vue";
import AddItemInput from "src/components/card/AddItemInput.vue";

const $q = useQuasar()
const enterpriseStore = useEnterpriseStore()
const isLoading = ref(true)
const establishmentsStore = useEstablishmentsStore()
const enterpriseData = ref(null)
const newEstablishment = ref(null);

onMounted(async () => {
  try {
    await fetchEnterprise()
  } finally {
    isLoading.value = false;
  }
});

const fetchEnterprise = async () => {
  enterpriseData.value = await enterpriseStore.getEnterprise()
}

const addEstablishment = async (name, callback) => {
  const data = {
    name
  }

  const response = await establishmentsStore.addEstablishment(data)

  if (!response?.data) {
    if (typeof callback === 'function') {
      callback(false)
    }
  } else {
    enterpriseData.value.establishments.push(response.data);
    newEstablishment.value = "";
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
