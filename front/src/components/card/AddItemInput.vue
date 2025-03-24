<template>
  <section :class="$q.screen.lt.md ? 'q-pa-md' : 'row justify-start'">
    <div class="col-12 items-center" :class="$q.screen.lt.md ? '' : 'row q-gutter-x-md'">
      <span class="q-my-auto text-blue" :class="$q.screen.lt.md ? 'q-pb-xs' : 'col-auto'">
        {{ label }}
      </span>
      <q-input v-model="itemValue" :type="itemType" outlined dense class="desktop-only col-3"></q-input>
      <div :class="$q.screen.lt.md ? 'row items-center' : 'col-auto'">
        <q-input v-model="itemValue" :type="itemType" outlined dense class="mobile-only col q-pr-sm"></q-input>
        <AddButton :text="buttonText" :disable="!itemValue" @click="submitForm" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import AddButton from 'src/components/buttons/AddButton.vue'

defineProps({
  label: String,
  itemType: { type: String, default: 'text' },
  buttonText: String
})

const itemValue = ref(null)

const emit = defineEmits(['click'])

const submitForm = async () => {
  const success = await new Promise((resolve) => {
    emit('click', itemValue.value, resolve)
  })

  if (success) {
    itemValue.value = ''
  } else {
    console.error("Erreur lors de l'ajout.")
  }
}
</script>

<style scoped></style>
