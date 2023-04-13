<script setup lang="ts">
import store from '@/store'
</script>

<template>
  <column grow>
    <row grow>
      <column shrink>
        <cell>
          <row>
            <button grow @click="store.addNote()">Add</button>
          </row>
          <row v-for="note in store.selectedSheet.notes">
            <button grow @click="store.selectedNoteId = note.id">{{ note.title }}</button>
          </row>
        </cell>
      </column>
      <column v-if="store.selectedNote">
        <cell>
          <row>
            <column grow>
              <row>
                <input type="text" font-size="2" margin-right="0.5" v-model="store.selectedNote.title">
                <button @click="store.removeNote()">Delete</button>
              </row>
            </column>
            <column>
              <span right font-size="2">({{ store.selectedNote.date }})</span>
            </column>
          </row>
          <row grow>
            <textarea v-model="store.selectedNote!.content"></textarea>
          </row>
        </cell>
      </column>
    </row>
  </column>
</template>