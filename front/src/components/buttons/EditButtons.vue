<template>
  <div class="row items-center flex justify-between">
    <div v-if="isEditing">
      <q-btn id="save" icon="check" round size="sm" flat color="secondary" :disable="!isUpdated"
        @click="emit('save')"></q-btn>
      <q-btn id="cancel" icon="cancel" round size="sm" flat color="accent" @click="emit('cancel')"></q-btn>
    </div>
    <div v-else>
      <q-btn id="edit" icon="edit" round size="sm" flat color="secondary" @click="emit('edit')"></q-btn>
      <q-btn id="delete" icon="delete" round size="sm" flat color="negative" @click="emit('delete')"></q-btn>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  isEditing: Boolean,
  isUpdated: Boolean,
})

const emit = defineEmits(['save', 'cancel', 'edit', 'delete'])
</script>
