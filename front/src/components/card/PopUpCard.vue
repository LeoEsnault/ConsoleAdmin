<template>
  <q-card class="popup-card">
    <q-card-section class="header-section">
      <h3 id="popup-title" class="popup-title">{{ title }}</h3>
      <p id="popup-text" class="popup-text">{{ text }}</p>
    </q-card-section>

    <q-card-section class="custom-content">
      <slot name="customContent"></slot>
    </q-card-section>

    <q-card-actions class="action-section">
      <q-btn no-caps class="cancel-btn" label="Annuler" v-close-popup @click="emit('update:popUp', false)" />
      <q-btn :loading="loading" @click="emit('confirm')" no-caps class="confirm-btn" label="Valider">
        <template v-slot:loading>
          <q-spinner-ios size="1.5em" />
        </template>
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

defineProps({
  title: String,
  text: String,
  loading: Boolean,
  popUp: Boolean
});

const emit = defineEmits(["confirm", "update:popUp"]);
</script>


<style lang="scss" scoped>
.popup-card {
  max-width: 450px;
  width: 90vw;
  border-radius: 8px;
  background: #FFFFFF;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transition: transform 0.3s ease;

  .header-section {
    padding: 1.5rem 2rem 1rem;
    text-align: center;
  }

  .popup-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--q-primary);
    margin: 0 0 1rem;
    line-height: 1.4;
  }

  .popup-text {
    font-size: 0.875rem;
    color: rgba(0, 0, 0, 0.75);
    line-height: 1.5;
    margin: 0;
  }

  .custom-content {
    padding: 0 2rem;
  }

  .action-section {
    display: flex;
    justify-content: center;
    gap: 1rem;
    padding: 1.5rem 2rem;

    :deep(.q-btn) {
      min-width: 120px;
      height: 40px;
      border-radius: 8px;
      font-weight: 500;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
    }

    .cancel-btn {
      background: rgba(0, 0, 0, 0.05);
      color: rgba(0, 0, 0, 0.75);

      &:hover {
        background: rgba(0, 0, 0, 0.1);
      }
    }

    .confirm-btn {
      background: var(--q-primary);
      color: white;

      &:hover {
        opacity: 0.9;
      }
    }
  }
}

// Responsive adjustments
@media (max-width: 600px) {
  .popup-card {
    width: 95vw;

    .header-section,
    .custom-content,
    .action-section {
      padding-left: 1.25rem;
      padding-right: 1.25rem;
    }

    .action-section {
      flex-direction: column;

      :deep(.q-btn) {
        width: 100%;
      }
    }

    .confirm-btn {
      margin-left: 0;
    }
  }
}
</style>
