<script setup lang="ts">
import { onMounted, onUpdated, ref } from 'vue'
import { AbilityNames, Sheet, SkillNames, ArmorTypes } from '../models'
import '@/extensions'
import type { Note } from '../models/note.model'
import apiService from '@/services/ApiService'

let sheets = ref(await getSheets())
let sheetId = ref(sheets.value.size == 0 ? null : [...sheets.value][0][0])
let sheetData = ref(sheetId.value == null ? Sheet.new() : sheets.value.get(sheetId.value!))

async function getSheets() {
  return await apiService.GetSheetsAsync()
}

async function saveSheet() {
  await apiService.SaveSheetAsync(sheetId.value, sheetData.value!)
  sheets.value = await apiService.GetSheetsAsync()
  if(sheetId.value == null) {
    sheetId.value = [...sheets.value][0][0]
  }
}

function resizeTextArea(target: any) {
  target.style.height = "auto";
  target.style.height = target.scrollHeight + 'px';
}

function setupTextAreaResize() {
  for (const textArea of document.getElementsByTagName('textarea')) {
    resizeTextArea(textArea)
    let callback = (event: Event) => resizeTextArea(event.target)
    textArea.removeEventListener('input', callback)
    textArea.addEventListener('input', callback)
  }
}

let counter = ref(10)

onMounted(() => {
  setupTextAreaResize()

  // // @ts-ignore
  // if(window.saveInterval !== undefined) {
  //   // @ts-ignore
  //   window.clearInterval(window.saveInterval)
  // }

  // // @ts-ignore
  // window.saveInterval = window.setInterval(() => {
  //   counter.value--
  //   if(counter.value === 0) {
  //     counter.value = 10
  //     saveSheet()
  //   }
  // }, 1000)
})

onUpdated(() => {
  setupTextAreaResize()
})

enum Tabs {
  Sheet = 'sheet',
  Notes = 'notes'
}

let activeTab = ref(Tabs.Sheet)

function setActiveTab(tab: Tabs) {
  activeTab.value = tab
}

function isActiveTab(tab: Tabs): boolean {
  return activeTab.value === tab
}


function setActiveNote(id: string) {
  activeNote.value = sheetData.value.notes.find((note: Note) => note.id === id)
}

function isActiveNote(id: string) {
  return activeNote.value.id === id
}

function onSheetSelectionChange(event: Event) {
  // @ts-ignore
  sheetId = event.target?.value
  sheetData.value = sheets.get(sheetId)
}

function addSheet() {
  const key = sheetPrefix + crypto.randomUUID()
  const json = JSON.stringify(Sheet.new())
  localStorage.setItem(key, json)
}

function exportSheetJSON() {
  const blob = new Blob([JSON.stringify(sheetData.value)])
  const blobUrl = URL.createObjectURL(blob)
  var link = document.createElement('a')
  link.href = blobUrl
  link.download = `${sheetData.value.characterInfo.name}.json`
  link.click()
}

function print() {
  window.print()
}
</script>

<template>
<div class="container">
  <div class="row hide-print">
    <div id="sheet-selection" class="cell row shrink">
      <select @change="onSheetSelectionChange">
        <option v-for="sheet in sheets" :value="sheet[0]">{{ sheet[1].characterInfo.name }}</option>
      </select>
      <button @click="addSheet">+</button>
    </div>
    <div id="controls" class="cell row shrink button-group">
      <button @click="saveSheet">Save</button>
      <button @click="exportSheetJSON">Export JSON</button>
      <button @click="print">Print</button>
    </div>
    <div class="cell row shrink">
      <span>Autosaving in: {{ counter }}</span>
    </div>
    <div id="tab-buttons" class="cell row shrink button-group">
      <button @click="setActiveTab(Tabs.Sheet)" :disabled="isActiveTab(Tabs.Sheet)">Sheet</button>
      <button @click="setActiveTab(Tabs.Notes)" :disabled="isActiveTab(Tabs.Notes)">Notes</button>
    </div>
  </div>

  <div class="container" v-if="isActiveTab(Tabs.Sheet)">
    <div class="row">
      <div class="column">
        <div class="character-info cell">
          <div>
            <div class="labeled-input">
                <span class="label">Player Name</span>
                <input type="text" v-model="sheetData.characterInfo.playerName">
            </div>
            <div class="labeled-input">
                <span class="label">Character Name</span>
                <input type="text" v-model="sheetData.characterInfo.name">
            </div>
            <div class="labeled-input">
                <span class="label">Class</span>
                <input type="text" v-model="sheetData.characterInfo.class">
            </div>
            <div class="labeled-input">
                <span class="label">Level</span>
                <input type="text" v-model="sheetData.characterInfo.level">
            </div>
          </div>
          <div>
            <div class="labeled-input">
                <span class="label">Race</span>
                <input type="text" v-model="sheetData.characterInfo.race">
            </div>
            <div class="labeled-input">
                <span class="label">Background</span>
                <input type="text" v-model="sheetData.characterInfo.background">
            </div>
            <div class="labeled-input">
              <span class="label">Alignment</span>
              <input type="text" v-model="sheetData.characterInfo.alignment">
            </div>
            <div class="labeled-input">
              <span class="label">Experience Points</span>
              <input type="text" v-model="sheetData.characterInfo.experiencePoints">
            </div>
          </div>
        </div>
      </div>
    </div>
  
    <div class="row"> 
      <div id="ability-scores" class="column shrink">
        <div class="ability-score cell" v-for="abilityScore in sheetData.abilityScores" :key="abilityScore.name">
            <span class="name">{{ abilityScore.name }}</span>
            <span class="modifier">{{ abilityScore.modifier.formatModifier() }}</span>
            <input class="score" type="number" v-model="abilityScore.score"/>
        </div>
      </div>
  
      <div id="column-1" class="column">
        <div id="inspiration" class="labeled-input cell">
          <span class="label">Inspiration</span>
          <input type="number" v-model="sheetData.inspiration">
        </div>
  
        <div id="proficiency-bonus" class="labeled-input cell">
          <span class="label">Proficiency Bonus</span>
          <input type="number" v-model="sheetData.proficiencyBonus">
        </div>
  
        <div id="saving-throws" class="column cell">
          <div class="saving-throw" v-for="abilityScore in sheetData.abilityScores" :key="abilityScore.name">
            <input class="proficiency" type="checkbox" v-model="abilityScore.proficiency"/>
            <span class="name">{{ abilityScore.name }}</span>
            <span class="modifier">{{ (abilityScore.modifier + (abilityScore.proficiency ? sheetData.proficiencyBonus : 0)).formatModifier() }}</span>
          </div>
          <span class="column-label">Saving Throws</span>
        </div>
  
        <div id="skills" class="column cell">
          <div class="skill" v-for="skill in sheetData.skills" :key="skill.name">
            <input class="proficency" type="checkbox" v-model="skill.proficiency"/>
            <input class="expertise" type="checkbox" v-model="skill.expertise"/>
            <span class="name">{{ skill.name }}<span> ({{ sheetData.getAbilityForSkill(skill.name).name.substring(0, 3) }})</span></span>
            <span class="modifier">{{ (sheetData.getAbilityForSkill(skill.name).modifier + (skill.proficiency ? sheetData.proficiencyBonus * (skill.expertise ? 2 : 1) : 0)).formatModifier()  }}</span>
          </div>
          <span class="column-label">Skills</span>
        </div>
  
        <div id="passive-wisdom" class="cell">
          <span class="label">Passive Wisdom (Perception)</span>
          <span class="score">{{ 10 + sheetData.getAbilityScore(AbilityNames.Widsom).modifier + (sheetData.getSkill(SkillNames.Perception).proficiency ? sheetData.proficiencyBonus : 0) }}</span>
        </div>
  
        <div id="proficiencies" class="column cell">
          <div class="row">
            <div class="column">
              <div class="row">
                <span class="label">Lanuages</span>
                <button @click="sheetData.proficiencies.addLanguageProficieny" class="add-button">+</button>
              </div>
              <div class="row">
                <div class="column">
                  <div class="item row" v-for="(_, i) in sheetData.proficiencies.languages">
                    <input type="text" v-model="sheetData.proficiencies.languages[i]">
                    <button class="remove" @click="sheetData.proficiencies.removeLanguageProficiency(i)">-</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <div class="row">
            <div class="column">
              <div class="row">
                <span class="label">Armor</span>
                <button @click="sheetData.proficiencies.addArmorProficiency" class="add-button">+</button>
              </div>
              <div class="row">
                <div class="column">
                  <div class="item row" v-for="(_, i) in sheetData.proficiencies.armor">
                    <input type="text" v-model="sheetData.proficiencies.armor[i]">
                    <button class="remove" @click="sheetData.proficiencies.removeArmorProficiency(i)">-</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <div class="row">
            <div class="column">
              <div class="row">
                <span class="label">Weapons</span>
                <button @click="sheetData.proficiencies.addWeaponProficiency" class="add-button">+</button>
              </div>
              <div class="row">
                <div class="column">
                  <div class="item row" v-for="(_, i) in sheetData.proficiencies.weapons">
                    <input type="text" v-model="sheetData.proficiencies.weapons[i]">
                    <button class="remove" @click="sheetData.proficiencies.removeWeaponProficiency(i)">-</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <div class="row">
            <div class="column">
              <div class="row">
                <span class="label">Tools</span>
                <button @click="sheetData.proficiencies.addToolProficiency" class="add-button">+</button>
              </div>
              <div class="row">
                <div class="column">
                  <div class="item row" v-for="(_, i) in sheetData.proficiencies.tools">
                    <input type="text" v-model="sheetData.proficiencies.tools[i]">
                    <button class="remove" @click="sheetData.proficiencies.removeToolProficiency(i)">-</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <span class="column-label">Proficiencies</span>
        </div>
      </div>
  
      <div id="column-2" class="column">
        <div class="row">
          <div id="armor-class" class="cell">
            <div class="selector">
              <select v-model="sheetData.armor">
                <option v-for="armorType in ArmorTypes.ArmorTypeNameMap.keys()" :key="armorType" :value="armorType">{{ armorType }}</option>
              </select>
              <input type="checkbox" v-model="sheetData.shield"/>
            </div>
            <span class="score">{{ sheetData.getAc }}</span>
            <span class="label">Armor Class</span>
          </div>
  
          <div id="initiative" class="cell">
            <span class="score">{{ sheetData.getAbilityScore(AbilityNames.Dexterity).modifier.formatModifier() }}</span>
            <span class="label">Initiative</span>
          </div>
  
          <div id="speed" class="cell">
            <input type="number" class="score" v-model="sheetData.speed"/>
            <span class="label">Speed</span>
          </div>
        </div>
  
        <div class="row">
          <div id="hitpoint-maximum" class="cell">
            <input class="score" type="number" v-model="sheetData.maximumHitpoints">
            <span class="label">Hitpoint Maximum</span>
          </div>
  
          <div id="current-hitpoints" class="cell">
            <input class="score" type="number" v-model="sheetData.currentHitpoints">
            <span class="label">Current hitpoints</span>
          </div>
  
          <div id="temporary-hitpoints" class="cell">
            <input class="score" type="number" v-model="sheetData.temporaryHitpoints">
            <span class="label">Temporary hitpoints</span>
          </div>
        </div>
  
        <div class="row">
          <div id="hit-dice-maximum" class="cell">
            <input type="text" class="score" v-model="sheetData.hitDiceTotal">
            <span class="label">Hit Dice Maximum</span>
          </div>
  
          <div id="hit-dice" class="cell">
            <input type="text" class="score" v-model="sheetData.hitDice">
            <span class="label">Hit Dice</span>
          </div>
  
          <div id="death-saves" class="cell">
            <table>
              <tr>
                <td>Successes</td>
                <td class="row">
                  <input type="checkbox" v-for="(_, i) in sheetData.deathSaveSuccesses" :key="`death-save-success-${i}`" v-model="sheetData.deathSaveSuccesses[i]">
                </td>
              </tr>
              <tr>
                <td>Failures</td>
                <td class="row">
                  <input type="checkbox" v-for="(_, i) in sheetData.deathSaveFailures" :key="`death-save-failure-${i}`" v-model="sheetData.deathSaveFailures[i]">
                </td>
              </tr>
            </table>
          <span class="label">Death Saves</span>
          </div>
        </div>
  
        <div id="attacks" class="row cell">
          <div class="column">
            <div class="row add-button">
              <button @click="sheetData.addAttack">+</button>
            </div>
            <div class="row">
              <div class="column">
                <div class="attack row" v-for="(attack, i) in sheetData.attacks" :key="`attack-${i}`">
                  <input type="checkbox" v-model="attack.finesse">
                  <input class="name" type="text" v-model="attack.name">
                  <span class="attack-bonus">{{ (sheetData.proficiencyBonus + (attack.finesse ? sheetData.getAbilityScore(AbilityNames.Dexterity).modifier : sheetData.getAbilityScore(AbilityNames.Strength).modifier)).formatModifier() }}</span>
                  <input class="damage" type="text" v-model="attack.damage">
                  <span class="bonus-damage">{{ (attack.finesse ? sheetData.getAbilityScore(AbilityNames.Dexterity).modifier : sheetData.getAbilityScore(AbilityNames.Strength).modifier).formatModifier() }}</span>
                  <input class="damage-type" type="text" v-model="attack.damageType">
                  <button class="remove" @click="sheetData.removeAttack(i)">-</button>
                </div>
              </div>
            </div>
            <span class="column-label">Attacks</span>
          </div>
        </div>
  
        <div id="currency-equipment" class="row cell">
          <div class="column">
            <div class="row">
              <div id="currency" class="column shrink">
                <div class="row">
                  <span class="label">CP</span>
                 <input type="number" v-model="sheetData.currency.copper">
                </div>
                <div class="row">
                  <span class="label">SP</span>
                  <input type="number" v-model="sheetData.currency.silver">
                </div>
                <div class="row">
                  <span class="label">EP</span>
                  <input type="number" v-model="sheetData.currency.electrum">
                </div>
                <div class="row">
                  <span class="label">GP</span>
                  <input type="number" v-model="sheetData.currency.gold">
                </div>
                <div class="row">
                  <span class="label">PP</span>
                  <input type="number" v-model="sheetData.currency.platinum">
                </div>
              </div>
              <div id="equipment" class="column">
                <div class="row">
                  <div class="column">
                    <div class="header">
                      <span class="name">Name</span>
                      <span class="amount">Amount</span>
                      <button @click="sheetData.addEquipmentItem">+</button>
                    </div>
                    <div class="equipment-item" v-for="(item, i) in sheetData.equipment" :key="`equipment-item-${i}`">
                      <input class="name" type="text" v-model="item.name">
                      <input class="amount" type="number" v-model="item.amount">
                      <button class="remove" @click="sheetData.removeEquipmentItem(i)">-</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <span class="column-label">Equipment</span>
          </div>
        </div>
      </div>
  
      <div id="column-3" class="column">
        <div id="pibf">
          <div class="row">
            <div class="cell">
              <textarea v-model="sheetData.personalityTraits"></textarea>
              <span class="label">Personality Traits</span>
            </div>
          </div>
          <div class="row">
            <div class="cell">
              <textarea v-model="sheetData.ideals"></textarea>
              <span class="label">Ideals</span>
            </div>
          </div>
          <div class="row">
            <div class="cell">
              <textarea v-model="sheetData.bonds"></textarea>
              <span class="label">Bonds</span>
            </div>
          </div>
          <div class="row">
            <div class="cell">
              <textarea v-model="sheetData.flaws"></textarea>
              <span class="label">Flaws</span>
            </div>
          </div>
        </div>
  
        <div id="features" class="row cell">
          <div class="column">
            <div class="row add-button">
              <button @click="sheetData.addFeature">+</button>
            </div>
            <div class="row">
              <div class="column">
                <div class="item column" v-for="(item, i) in sheetData.features" :key="`item-${i}`">
                  <div class="row">
                    <input class="name" type="text" v-model="item.name">
                    <button @click="sheetData.removeFeature(i)">-</button>
                  </div>
                  <div class="row">
                    <textarea v-model="item.description"></textarea>
                  </div>
                </div>
              </div>
            </div>
            <span class="column-label">Features & Traits</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="container" v-if="isActiveTab(Tabs.Notes)">
    <div class="column">
      <div class="row">
        <div id="notes" class="row">
          <div class="cell column note-titles">
            <button class="row" @click="sheetData.addNote">Add note</button>
            <div class="row note-title" v-for="(note, i) in sheetData.notes">
              <input type="text" v-model="note.title" @click="setActiveNote(note.id)"> 
              <button @click="sheetData.removeNote(i)">-</button>
            </div>
          </div>
          <div class="cell column">
            <textarea v-model="activeNote.content"></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');

html, body {
  padding: 0;
  margin: 0;
  font-family: 'roboto';
  background-color: #121212;
  color: #FAFAFA;
  margin: .5rem;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
}

select,
input,
textarea,
button {
  background-color: #424242;
  color: #FAFAFA;
  border: 0;
  border-radius: .5rem;
  padding: .1rem .5rem;
}

button {
  &:disabled {
    background-color: #313131;
  }
}

textarea {
  font-family: 'roboto';
  width: 100%;
  box-sizing: border-box;
}

input {
  &[type=number] {
    padding-right: 0;
    padding-left: .9rem;
    text-align: center;
  }

  &[type=checkbox] {
    appearance: none;
    margin: 0;
    margin-right: .5rem;
    
    font: inherit;
    color: currentColor;
    width: 1.15rem;
    height: 1.15rem;
    border: 0.1rem solid #121212;
    border-radius: 1.15rem;
    transform: translateY(-0.075rem);
    
    display: grid;
    place-content: center;
    
    &::before {
      content: "";
      width: 0.65rem;
      height: 0.65rem;
      clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
      transform: scale(0);
      transform-origin: center center;
      transition: 120ms transform ease-in-out;
      box-shadow: inset 1rem 1rem #FAFAFA;
      background-color: CanvasText;
    }
    
    &:checked::before {
      transform: scale(.9);
    }
  }
}

.button-group {
  button {
    border-radius: 0;

    &:first-child {
      border-top-left-radius: .5rem;
      border-bottom-left-radius: .5rem;
    }

    &:last-child {
      border-top-right-radius: .5rem;
      border-bottom-right-radius: .5rem;
    }
  }
}

.column {
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  margin-right: .5rem;
  height: fit-content;
  width: 100%;

  &.shrink {
    width: fit-content !important;
  }

  .cell {
    margin-bottom: .5rem;
    width: 100%;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .column {
    margin-right: 0;
  }

  > .column-label {
    text-align: center;
    margin-top: .5rem;
  }

  &:last-child {
    margin-right: 0;
  }
}

.row {
  box-sizing: border-box;
  display: flex;
  flex-direction: row !important;
  margin-bottom: .5rem;
  width: 100%;

  > .cell {
    margin-right: .5rem;
    margin-bottom: 0;

    &:last-child {
      margin-right: 0;
    }
  }

  > .column {
    width: 100%;
  }

  &.cell {
    align-items: flex-start;
  }

  &.cell .column+.column {
    margin-left: .5rem; 
  }

  &.shrink {
    width: fit-content;
  }
}

.cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #212121;
  border: solid 1px #424242;
  border-radius: .5rem;
  padding: .5rem;
  box-sizing: border-box;
}

.character-info {
  > div {
  display: flex;

  .labeled-input {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    margin-right: .5rem;

    &:last-child {
        margin-right: 0;
      }
    }
  }
}

.ability-score {
  .name {
    font-size: 0.8rem;
  }

  .modifier {
    font-size: 1.5rem;
  }

  .score {
    width: 2rem;
  }
}

.saving-throw {
  display: flex;
  align-self: stretch;

  .name {
   flex-grow: 1;
  }
  
  > * {
    margin-right: 1rem;

    &:last-child {
      margin-right: 0;
    }
  }
}

.skill {
  display: flex;
  align-self: stretch;

  .name {
    flex-grow: 1;
  }
    
  > * {
    margin-right: 1rem;

    &:first-child {
      margin-right: .5rem;
    }

    &:last-child {
      margin-right: 0;
   }
  }
}

#inspiration,
#proficiency-bonus {
  flex-direction:  row;

  input {
    width: 2rem;
  }

  .label {
    flex-grow: 1;
  }
}

#passive-wisdom {
  flex-direction: row;

  .label {
    flex-grow: 1;
  }
}

#armor-class {
  .selector {
    margin-bottom: .5rem;
    display: flex;
    flex-direction: row;
    align-items: center;

    select {
      margin-right: .5rem;
    }
  }

  .score {
    font-size: 1.5rem;
  }

  .label {
    margin-top: .5rem;
  }
}

#initiative {
  .score {
    display: flex;  
    font-size: 2rem;
    flex-grow: 1;
    align-items: center;
  }
}

#speed,
#current-hitpoints,
#hitpoint-maximum,
#temporary-hitpoints,
#hit-dice-maximum,
#hit-dice {
  .score {
    display: flex;
    align-items: center;
    flex-grow: 1;
    font-size: 2rem;
    width: 3.5rem;
    height: 3.5rem;
  }

  .label {
    margin-top: .5rem;
  }
}

#death-saves {
  table {
    border-spacing: .5rem;
    
    td.row {
      margin-bottom: 0;
    }
  }
}

#currency {
  display: flex;
  align-self: flex-start;

  > div {
    align-items: flex-start;
  }

  .label {
    margin-right: .5rem;
    flex-grow: 1;
  }

  input {
    width: 3rem;
  }
}

#equipment {
  height: 100%;

  .equipment-item {
    display: flex;
    margin-bottom: .5rem; 

    .name {
      flex-grow: 1;
      margin-right: .5rem;
    }

    .amount {
      width: 3rem;
      margin-right: .5rem;
    }
  }

  .header {
    display: flex;
    margin-bottom: .5rem; 

    .name {
      flex-grow: 1;
    }

    .amount {
      margin-right: .5rem;
    }
  }
}

#attacks {
  .add-button {
    justify-content: flex-end;
  }

  .attack {
    display: flex;
    
    * {
      margin-right: .5rem;

      &:last-child {
        margin-right: 0;
      }
    }

    .name {
      flex-grow: 1;
    }

    .damage {
      width: 2rem;
    }

    .damage-type {
      width: 5rem;
    }
  }
}

#pibf {
  .label {
    margin-top: .5rem;  
  }
}

#features {
  .add-button {
    justify-content: flex-end;
  }

  .item {
    display: flex;
    margin: 0;
    margin-bottom: .5rem;

    &:last-child {
      margin-bottom: 0;
    }

    * {
      margin-right: .5rem;

      &:last-child {
        margin-right: 0;
      }

      .name {
        flex-grow: 1;
      }
    }
  }
}

#proficiencies {
  .row {
    width: 100%;
  }

  .label {
    flex-grow: 1;
  }

  .item {
    input {
      flex-grow: 1;
      margin-right: .5rem;
    }
  }
}

#notes {
  .note-titles {
    width: fit-content;

    .note-title {
      > * {
        margin-right: .5rem;

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
}

#sheet-selection {
  > * {
    margin-right: .5rem;

    &:last-child {
      margin-right: 0;
    }
  }
}

@media print {
  @page {
    size: A4;
    margin: 0;
}

  html, body {
    width: 210mm;
    height: 297mm;
  }

  .container {
    align-items: flex-start;
  }

  .hide-print {
    display: none;
  }

  html,
  body
  .container,
  .cell,
  input,
  select,
  button,
  textarea {
    background-color: white;
    color: black;
  }
}
</style>
