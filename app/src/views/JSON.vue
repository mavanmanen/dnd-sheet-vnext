<script setup lang="ts">
import sheetConverter from '@/sheet-converter'
import store from '@/store'
import { ref, watch } from 'vue'
await store.initAsync()

let json = ref(sheetConverter.toJSON(store.selectedSheet, 2))
watch(json, () => {
  try {
    store.selectedSheet = sheetConverter.fromJSON(json.value)
  } catch (error) {
    console.error(error)
  }
})

</script>

<template>
  <cell>
    <span>This may break the application if invalid values are supplied. Use at your own caution.</span>
    <textarea grow v-model="json"></textarea>
  </cell>
</template>