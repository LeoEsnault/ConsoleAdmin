<template>
  <q-page class="column flex justify-center q-py-lg">
    <!-- Version Desktop -->
    <div class="q-px-xl column q-gutter-y-md desktop-only">
      <AddItemInput label="Ajouter un établissement:" itemType="text"
        buttonText="Vous ne pouvez pas créer un établissement ayant un nom déjà utilisé." @click="addEstablishment" />
      <div v-if="isLoading" class="q-px-xs">
        <SkeletonText v-for="n in 3" :key="n" class="q-ma-xs" />
      </div>

      <div v-else-if="enterpriseData" class="q-gutter-y-md">
        <div class="row bg-grey-11 q-py-md q-gutter-x-md rounded-borders text-caption">
          <div class="col-1"></div>
          <span class="col-2">Établissements</span>
          <!-- <span class="col-4">Services</span>
        <div class="col-2">Ajouter des services</div> -->
          <div class="col-1"></div>
        </div>

        <!-- Message si aucun établissement -->
        <div v-if="!enterpriseData.establishments?.length" class="text-grey-7 q-pa-md text-center">
          Aucun établissement.
        </div>

        <!-- Liste des établissements -->
        <div v-else v-for="(establishment) in enterpriseData.establishments" :key="establishment.id">
          <ManageEstablishment id="ManageEstablishment" :establishment="establishment"
            @deleteEstablishment="fetchEnterprise()" class="col" />
        </div>
      </div>
    </div>

    <!-- Version Mobile -->
    <div class="column flex content-center mobile-only q-pa-sm">
      <AddItemInput label="Ajouter un établissement:" itemType="text"
        buttonText="Vous ne pouvez pas créer un établissement ayant un nom déjà utilisé." @click="addEstablishment" />
      <q-expansion-item expand-separator icon="menu" label="Établissements"
        class="bg-grey-13 rounded-borders q-pb-none q-mb-lg" style="border: 1px solid #d3d3d3; width: 100%">
        <q-card class="q-pa-xs bg-grey-1">
          <section class="q-px-sm">
            <div class="row items-center q-py-sm justify-between">
              <span class="q-my-auto text-blue q-pb-xs">Ajouter un établissement :</span>
              <div class="row items-center">
                <q-input v-model="newEstablishment" outlined dense class="col q-pr-sm"></q-input>
                <q-btn icon="add" round size="sm" color="secondary" @click="addEstablishment"
                  :disable="!newEstablishment">
                  <q-tooltip>
                    Vous ne pouvez pas créer un établissement ayant un nom déjà utilisé.
                  </q-tooltip>
                </q-btn>
              </div>
            </div>
          </section>
        </q-card>
      </q-expansion-item>

      <div v-if="isLoading" class="q-px-xs">
        <SkeletonRange v-for="n in 3" :key="n" class="q-my-xs" />
      </div>

      <div v-else-if="enterpriseData" class="q-gutter-y-md">
        <div v-if="!enterpriseData.establishments?.length" class="text-grey-7 q-pa-md text-center">
          Aucun établissement.
        </div>

        <div v-else v-for="(establishment) in enterpriseData.establishments" :key="establishment.id">
          <ManageEstablishment :establishment="establishment" @deleteEstablishment="fetchEnterprise()" class="col" />
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
const isLoading = ref(true) // TODO SKELETON et passage à true
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
