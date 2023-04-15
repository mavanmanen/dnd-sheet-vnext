<script setup lang="ts">
import store from '@/store'
await store.initAsync()
</script>

<template>
  <column>
    <row v-for="[key, value] in store.selectedSheet.parameters">
      <cell row shrink>
        <column shrink>{{ key }}</column>
        <column>
          <input type="number" :value="value"
            @change="e => store.selectedSheet.parameters.set(key, parseInt(e.target.value))">
        </column>
      </cell>
    </row>
  </column>
</template>