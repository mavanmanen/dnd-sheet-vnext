<script setup lang="ts">
import store from '@/store'
import router from '@/router'
await store.initAsync()
</script>

<template>
  <column grow>
    <row>
      <column shrink>
        <cell row>
          <select v-model="store.selectedSheetId" margin-right="0.5">
            <option v-for="sheet in store.sheets" :value="sheet.id">{{ sheet.characterInfo.name }}</option>
          </select>
          <button @click="store.newSheetAsync()" margin-right="0.5">+</button>
          <button @click="store.deleteSheetAsync()">-</button>
        </cell>
      </column>

      <column shrink>
        <cell row>
          <button-group>
            <router-link v-for="route in router.getRoutes()" :to="route.path" v-slot="{ navigate }">
              <button @click="navigate" role="link">{{ route.name }}</button>
            </router-link>
          </button-group>
        </cell>
      </column>

      <column shrink>
        <cell row>
          <button-group>
            <button @click="store.saveSheetAsync()">Save</button>
            <button @click="store.exportSheetJSON()">Export JSON</button>
          </button-group>
        </cell>
      </column>
    </row>

    <row grow>
      <slot grow></slot>
    </row>
  </column>
</template>