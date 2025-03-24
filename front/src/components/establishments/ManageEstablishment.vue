<template>
  <div>
    <!-- Version Desktop -->
    <div class="row items-center q-gutter-x-md desktop-only">
      <div class="col-1"></div>

      <div class="col-2" v-if="editingEsta">
        <q-input v-model="establishmentName" rounded outlined dense
          class="establishmentNameInput text-caption"></q-input>
      </div>
      <div class="col-2" v-if="!editingEsta">
        <div class="establishmentName">{{ establishmentName }}</div>
      </div>

      <div class="col-1 text-center">
        <EditButtons :isEditing="editingEsta" :isUpdated="isUpdated" @save="save" @cancel="reset" @edit="editEsta"
          @delete="deleteEstablishment" />
      </div>
    </div>

    <!-- Version Mobile -->
    <div class="mobile-only" style="max-width: 50rem">
      <q-list bordered class="rounded-borders">
        <q-expansion-item expand-separator>
          <template v-slot:header>
            <q-item-section class="establishmentName">
              {{ establishmentName }}
            </q-item-section>
          </template>
          <q-card>
            <q-card-section class="bg-grey-11 row items-center flex justify-between">
              <div class="col-8">
                <div v-if="editingEsta" class="col-2 q-pb-sm">
                  <q-input v-model="establishmentName" rounded outlined dense
                    class="establishmentNameInput text-caption"></q-input>
                </div>
                <div v-if="!editingEsta" class="col-2 q-pb-sm">
                  <div>{{ establishmentName }}</div>
                </div>
              </div>

              <div class="row items-center flex justify-between">
                <EditButtons :isEditing="editingEsta" :isUpdated="isUpdated" @save="save" @cancel="reset"
                  @edit="editEsta" @delete="deleteEstablishment" />
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
import { useEstablishmentsStore } from "src/stores/establishments-store";
import { useQuasar } from 'quasar'
import EditButtons from "../buttons/EditButtons.vue";

const $q = useQuasar()
const props = defineProps(["establishment"]);
const emit = defineEmits(['deleteEstablishment'])

const establishementsStore = useEstablishmentsStore()
const establishmentName = ref(null);
const editingEsta = ref(false);

const editEsta = () => {
  editingEsta.value = true;
};

const deleteEstablishment = async () => {
  const response = await establishementsStore.deleteEstablishment(props.establishment.id)

  if (response?.type === 'positive') {
    emit('deleteEstablishment')
  }

  $q.notify({
    type: response?.type,
    message: response?.message
  })
};

const isUpdated = computed(() => {
  return (
    establishmentName.value != props.establishment.name
  );
});

const reset = () => {
  establishmentName.value = props.establishment.name;
  editingEsta.value = false;
};

const save = async () => {
  const data = {
    name: establishmentName.value
  }

  const response = await establishementsStore.updateEstablishment(props.establishment.id, data)

  if (response?.type === "positive") {
    editingEsta.value = false
  }

  $q.notify({
    type: response?.type,
    message: response?.message
  })

};

watch(
  () => props.establishment,
  (newVal) => {
    establishmentName.value = newVal.name;
    reset();
  },
  { deep: true, immediate: true }
);

onMounted(() => {
  establishmentName.value = props.establishment.name;
});
</script>
