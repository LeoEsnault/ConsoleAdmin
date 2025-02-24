<template>
  <q-btn icon="add" round size="sm" color="secondary" @click="handleClick" :disable="disable">
    <q-tooltip>{{ text }}</q-tooltip>
  </q-btn>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";
const props = defineProps({
  text: {
    type: String,
  },
  disable: Boolean,
});

const text = ref(props.text)

const emit = defineEmits(['click']);

const handleClick = () => {
  emit('click');
};
</script>

<style scoped></style>
