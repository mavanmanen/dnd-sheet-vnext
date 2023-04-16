<script setup lang="ts">
import store from '@/store'
import { textAreaResize } from '@/textarea-resize'

textAreaResize()
await store.initAsync()

console.log(store.selectedSheet.background)

function selectImage() {
  document.getElementById('hidden-file-input')?.click()
}

function imageSelected(files: FileList) {
  if (files.length == 0) {
    return
  }

  const file = files.item(0)! as Blob
  const reader = new FileReader()
  reader.onload = () => {
    store.selectedSheet.background.image = reader.result as string
  }
  reader.readAsDataURL(file)
}
</script>

<template>
  <column>
    <row>
      <cell row>
        <column>
          <row>
            <span>Age</span>
          </row>
          <row>
            <input type="text" v-model="store.selectedSheet.background.age">
          </row>
        </column>

        <column>
          <row>
            <span>Height</span>
          </row>
          <row>
            <input type="text" v-model="store.selectedSheet.background.height">
          </row>
        </column>

        <column>
          <row>
            <span>Weight</span>
          </row>
          <row>
            <input type="text" v-model="store.selectedSheet.background.weight">
          </row>
        </column>

        <column>
          <row>
            <span>Eyes</span>
          </row>
          <row>
            <input type="text" v-model="store.selectedSheet.background.eyes">
          </row>
        </column>

        <column>
          <row>
            <span>Skin</span>
          </row>
          <row>
            <input type="text" v-model="store.selectedSheet.background.skin">
          </row>
        </column>

        <column>
          <row>
            <span>Hair</span>
          </row>
          <row>
            <input type="text" v-model="store.selectedSheet.background.hair">
          </row>
        </column>
      </cell>
    </row>

    <row grow>
      <column style="max-width: 400px;">
        <row>
          <cell>
            <row grow>
              <img id="character-image" :src="store.selectedSheet.background.image" @click="selectImage()">
              <input hidden id="hidden-file-input" type="file" accept=".jpg, .png, .jpeg"
                @change="e => imageSelected(e.target.files)">
            </row>
            <footer>Character Appearance</footer>
          </cell>
        </row>
      </column>

      <column>
        <row grow>
          <cell>
            <textarea grow v-model="store.selectedSheet.background.backstory"></textarea>
            <footer>Character Backstory</footer>
          </cell>
        </row>
      </column>

      <column>
        <row grow>
          <cell>
            <textarea grow v-model="store.selectedSheet.pibf.personalityTraits"></textarea>
            <footer>Personality Traits</footer>
          </cell>
        </row>

        <row grow>
          <cell>
            <textarea grow v-model="store.selectedSheet.pibf.ideals"></textarea>
            <footer>Ideals</footer>
          </cell>
        </row>

        <row grow>
          <cell>
            <textarea grow v-model="store.selectedSheet.pibf.bonds"></textarea>
            <footer>Bonds</footer>
          </cell>
        </row>

        <row grow>
          <cell>
            <textarea grow v-model="store.selectedSheet.pibf.flaws"></textarea>
            <footer>Flaws</footer>
          </cell>
        </row>

        <row grow>
          <cell>
            <textarea grow v-model="store.selectedSheet.background.alliesOrganizations"></textarea>
            <footer>Allies & Organisations</footer>
          </cell>
        </row>

        <row grow>
          <cell>
            <textarea grow v-model="store.selectedSheet.background.additionalFeaturesTraits"></textarea>
            <footer>Additional Features & Traits</footer>
          </cell>
        </row>

        <row grow>
          <cell>
            <textarea grow v-model="store.selectedSheet.background.treasure"></textarea>
            <footer>Treasure</footer>
          </cell>
        </row>
      </column>
    </row>
  </column>
</template>

<Style lang="scss">
#character-image {
  border: 1px black dashed;
  cursor: pointer;
  object-fit: contain;
  height: auto;
  width: auto;
  max-width: 200px;
  min-width: 100%;
  border-radius: 0.5rem;
}
</Style>