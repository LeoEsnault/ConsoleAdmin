<template>
  <div>
    <!-- Version Desktop -->
    <div class="row items-center q-gutter-x-md desktop-only">
      <div class="col-1"></div>

      <div class="col-2" v-if="editing">
        <q-input v-model="serviceName" rounded outlined dense class="serviceNameInput text-caption"></q-input>
      </div>
      <div class="col-2" v-if="!editing">
        <div class="serviceName">{{ serviceName }}</div>
      </div>

      <div class="col-5"></div>

      <div class="col text-center">
        <EditButtons :isEditing="editing" :isUpdated="isUpdated" @save="save" @cancel="reset" @edit="editEsta"
          @delete="deleteService" />
      </div>
    </div>

    <!-- Version Mobile -->
    <div class="mobile-only" style="max-width: 50rem">
      <q-list bordered class="rounded-borders">
        <q-expansion-item expand-separator>
          <template v-slot:header>
            <q-item-section class="serviceName">
              {{ serviceName }}
            </q-item-section>
          </template>
          <q-card>
            <q-card-section class="bg-grey-11 row items-center flex justify-between">
              <div class="col-8">
                <div v-if="editing" class="col-2 q-pb-sm">
                  <q-input v-model="serviceName" rounded outlined dense class="serviceNameInput text-caption"></q-input>
                </div>
                <div v-if="!editing" class="col-2 q-pb-sm">
                  <div>{{ serviceName }}</div>
                </div>
              </div>

              <div class="row items-center flex justify-between">
                <EditButtons :isEditing="editing" :isUpdated="isUpdated" @save="save" @cancel="reset" @edit="editEsta"
                  @delete="deleteService" />
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, watch, defineProps, defineEmits, computed } from "vue";
import { useServicesStore } from "src/stores/services-store";
import { useQuasar } from 'quasar'
import EditButtons from "../buttons/EditButtons.vue";

const $q = useQuasar()
const props = defineProps(["service"]);
const emit = defineEmits(['deleteService'])

const establishementsStore = useServicesStore()
const serviceName = ref(null);
const editing = ref(false);

const editEsta = () => {
  editing.value = true;
};

const deleteService = async () => {
  const response = await establishementsStore.deleteService(props.service.id)

  if (response?.type === 'positive') {
    emit('deleteService')
  }

  $q.notify({
    type: response?.type,
    message: response?.message
  })
};

const isUpdated = computed(() => {
  return (
    serviceName.value != props.service.name
  );
});

const reset = () => {
  serviceName.value = props.service.name;
  editing.value = false;
};

const save = async () => {
  const data = {
    name: serviceName.value
  }

  const response = await establishementsStore.updateService(props.service.id, data)

  if (response?.type === "positive") {
    editing.value = false
  }

  $q.notify({
    type: response?.type,
    message: response?.message
  })

};

watch(
  () => props.service,
  (newVal) => {
    serviceName.value = newVal.name;
    reset();
  },
  { deep: true, immediate: true }
);

onMounted(() => {
  serviceName.value = props.service.name;
});
</script>
