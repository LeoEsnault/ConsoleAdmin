<template>
  <div>
  <div class="desktop-only row items-center q-gutter-x-md">
    <div class="col">
      <div id="userEmail">{{ userEmail }}</div>
    </div>

    <div class="col">
      <div id="userLastname">{{ userLastname }}</div>
    </div>

    <div class="col">
      <div id="userFirstname">{{ userFirstname }}</div>
    </div>

    <div class="col"></div>
  </div>

  <div class="mobile-only col col-12" style="max-width: 50rem">
    <q-list bordered class="rounded-borders">
      <q-expansion-item expand-separator>
        <template v-slot:header>
          <q-item-section id="userEmail">
            {{ userEmail }}
          </q-item-section>
        </template>
        <q-card>
          <q-card-section class="bg-grey-11 row items-center flex justify-between">
            <div>
              <div class="col-1 row">
                <div id="userLastname" class="q-mr-xs">{{ userLastname }}</div>
                <div id="userFirstname">{{ userFirstname }}</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
  </div>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps(['user'])

const userEmail = ref(null)
const userLastname = ref(null)
const userFirstname = ref(null)

onMounted(async () => {
  userLastname.value = props.user?.profile?.lastname
  userFirstname.value = props.user?.profile?.firstname
  userEmail.value = props.user.email
})
</script>
