<template>
  <q-dialog persistent transition-show="scale" transition-hide="scale">
    <PopUpCard v-bind="props" @confirm="emit('confirm')" @update:popUp="emit('update:popUp', $event)" />
  </q-dialog>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import PopUpCard from './PopUpCard.vue'

const props = defineProps({
  title: String,
  text: String,
  popUp: Boolean,
  loading: Boolean,
})

const emit = defineEmits(['confirm', 'update:popUp'])
</script>
