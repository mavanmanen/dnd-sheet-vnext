<script setup lang="ts">
import { ref } from 'vue'
import store from '@/store'
await store.initAsync()
let parameters = ref(store.selectedSheet.parameters)
</script>

<template>
  <column>
    <row v-for="[key, value] in parameters">
      <cell row shrink>
        <column shrink>{{ key }}</column>
        <column>
          <input type="number" :value="value" @change="e => parameters.set(key, parseInt(e.target.value))">
        </column>
      </cell>
    </row>
  </column>
</template>