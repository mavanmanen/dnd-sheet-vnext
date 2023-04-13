<script setup lang="ts">
import store from '@/store'
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
            <router-link to="/" v-slot="{ navigate }">
              <button @click="navigate" role="link">Sheet</button>
            </router-link>

            <router-link to="/magic" v-slot="{ navigate }">
              <button @click="navigate" role="link">Magic</button>
            </router-link>

            <router-link to="/notes" v-slot="{ navigate }">
              <button @click="navigate" role="link">Notes</button>
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