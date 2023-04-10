<script setup lang="ts">
import '@/extensions'
import { onMounted, onUpdated, ref } from 'vue'
import { Api, type Ability, type Skill, type Sheet, type Attack, type Feature, type Equipment } from '@/services/Api'

interface User {
  clientPrincipal: {
    userId: string
    userRoles: string[]
    claims: string[]
    identityProvider: string
    userDetails: string
  }
}

enum Tab {
  Sheet = 'sheet',
  Notes = 'notes'
}

enum ProficiencyType {
  Language,
  Armor,
  Weapon,
  Tool
}

const armorTypeAc = new Map<string, number>([
    [ 'Padded', 11 ],
    [ 'Leather', 11 ],
    [ 'Studded Leather', 12 ],
    [ 'Hide', 12 ],
    [ 'Chain Shirt', 13 ],
    [ 'Scale Mail', 14 ],
    [ 'Breastplate', 14 ],
    [ 'Ring Mail', 14 ],
    [ 'Half Plate', 15 ],
    [ 'Chain Mail', 16 ],
    [ 'Splint', 17 ],
    [ 'Plate', 18 ]
])

const apiClient = new Api()
const user = await getUserAsync()

let sheets = ref(new Array<Sheet>())
let selectedSheetId = ref<number | undefined>()
let selectedSheet = ref(newSheet(user.clientPrincipal.userId))
let activeTab = ref(Tab.Sheet)

async function getUserAsync(): Promise<User> {
  const response = await fetch('/.auth/me')
  return await response.json() as User
}

async function saveSheetAsync(): Promise<void> {
  const sheet = await apiClient.api.addUpdateSheet(user.clientPrincipal.userId, selectedSheetId.value, selectedSheet.value)
  await loadSheetsAsync();
  selectedSheetId.value = sheet.id
  selectedSheet.value = sheet
}

function newSheet(userId: string): Sheet {
  return {
    id: undefined,
    characterInfo: {
      name: '',
      playerName: '',
      race: '',
      level: 0,
      class: '',
      alignment: '',
      background: '',
      experiencePoints: 0
    },
    abilities: [
      { name: 'Strength', shortname: 'Str', score: 0, proficiency: false },
      { name: 'Dexterity', shortname: 'Dex', score: 0, proficiency: false },
      { name: 'Constitution', shortname: 'Con', score: 0, proficiency: false },
      { name: 'Intelligence', shortname: 'Int', score: 0, proficiency: false },
      { name: 'Wisdom', shortname: 'Wis', score: 0, proficiency: false },
      { name: 'Charisma', shortname: 'Cha', score: 0, proficiency: false }
    ],
    armor: {
      shield: false,
      type: armorTypeAc.keys().next().value as string
    },
    attacks: [],
    currency: {
      copper: 0,
      electrum: 0,
      gold: 0,
      platinum: 0,
      silver: 0
    },
    deathSave: {
      failure: [false, false, false],
      success: [false, false, false]
    },
    equipment: [],
    features: [],
    general: {
      inspiration: 0,
      proficiencyBonus: 0,
      speed: 0
    },
    healthPoints: {
      current: 0,
      maximum: 0,
      temporary: 0
    },
    hitDice: {
      current: '',
      max: ''
    },
    notes: [],
    pibf: {
      bonds: '',
      flaws: '',
      ideals: '',
      personalityTraits: ''
    },
    proficiencies: {
      armor: [],
      languages: [],
      tools: [],
      weapons: []
    },
    skills: [
      { name: 'Acrobatics', proficiency: false, expertise: false },
      { name: 'Animal Handling', proficiency: false, expertise: false },
      { name: 'Arcana', proficiency: false, expertise: false },
      { name: 'Athletics', proficiency: false, expertise: false },
      { name: 'Deception', proficiency: false, expertise: false },
      { name: 'History', proficiency: false, expertise: false },
      { name: 'Insight', proficiency: false, expertise: false },
      { name: 'Intimidation', proficiency: false, expertise: false },
      { name: 'Investigation', proficiency: false, expertise: false },
      { name: 'Medicine', proficiency: false, expertise: false },
      { name: 'Nature', proficiency: false, expertise: false },
      { name: 'Perception', proficiency: false, expertise: false },
      { name: 'Performance', proficiency: false, expertise: false },
      { name: 'Persuasion', proficiency: false, expertise: false },
      { name: 'Religion', proficiency: false, expertise: false },
      { name: 'Sleight of Hand', proficiency: false, expertise: false },
      { name: 'Stealth', proficiency: false, expertise: false },
      { name: 'Survival', proficiency: false, expertise: false }
    ],
    userId: userId
  }
}

async function newSheetAsync(): Promise<Sheet> {
  return await apiClient.api.addUpdateSheet(user.clientPrincipal.userId, undefined, newSheet(user.clientPrincipal.userId))
}

async function addSheetAsync() {
  const sheet = await newSheetAsync()
  selectedSheet.value = sheet
  selectedSheetId.value = selectedSheet.value.id
  sheets.value.push(selectedSheet.value)
}

async function deleteSheetAsync(id: number): Promise<void> {
  if(window.confirm("Are you sure you want to delete this sheet?")) {
    await apiClient.api.deleteSheet(user.clientPrincipal.userId, id)
    await loadSheetsAsync()
  }
}

async function loadSheetsAsync(): Promise<void> {
  sheets.value = await apiClient.api.userSheets(user.clientPrincipal.userId)
  console.log(sheets.value)
}

function setActiveTab(tab: Tab) {
  activeTab.value = tab
}

function isActiveTab(tab: Tab): boolean {
  return activeTab.value === tab
}

function resizeTextArea(target: any) {
  target.style.height = 'auto' 
  target.style.height = target.scrollHeight + 'px'
}

function setupTextAreaResize() {
  for (const textArea of document.getElementsByTagName('textarea')) {
    resizeTextArea(textArea)
    let callback = (event: Event) => resizeTextArea(event.target)
    textArea.removeEventListener('input', callback)
    textArea.addEventListener('input', callback)
  }
}

onMounted(() => {
  setupTextAreaResize()
})

onUpdated(() => {
  setupTextAreaResize()
})

const skillToAbility = new Map<string, string>([
    [ 'Acrobatics', 'Dexterity' ],
    [ 'Animal Handling', 'Wisdom' ],
    [ 'Arcana', 'Intelligence' ],
    [ 'Athletics', 'Strength' ],
    [ 'Deception', 'Charisma' ],
    [ 'History', 'Intelligence' ],
    [ 'Insight', 'Wisdom' ],
    [ 'Intimidation', 'Charisma' ],
    [ 'Investigation', 'Intelligence' ],
    [ 'Medicine', 'Wisdom' ],
    [ 'Nature', 'Intelligence' ],
    [ 'Perception', 'Wisdom' ],
    [ 'Performance', 'Charisma' ],
    [ 'Persuasion', 'Charisma' ],
    [ 'Religion', 'Intelligence' ],
    [ 'Sleight of Hand', 'Dexterity' ],
    [ 'Stealth', 'Dexterity' ],
    [ 'Survival', 'Wisdom' ]
])

function getAbilityForSkill(skill: Skill): Ability {
  return selectedSheet.value.abilities.find((x: Ability) => x.name === skillToAbility.get(skill.name))!
}

function getAbility(name: string): Ability {
    return selectedSheet.value.abilities.find((x: Ability) => x.name === name)!
}

function getSkill(name: string): Skill {
    return selectedSheet.value.skills.find((x: Skill) => x.name === name)!
}

function addProficiency(type: ProficiencyType) {
  switch(type) {
    case ProficiencyType.Language:
      selectedSheet.value.proficiencies.languages.push('')
      break

    case ProficiencyType.Armor:
      selectedSheet.value.proficiencies.armor.push('')
      break

    case ProficiencyType.Weapon:
      selectedSheet.value.proficiencies.weapons.push('')
      break

    case ProficiencyType.Tool:
      selectedSheet.value.proficiencies.tools.push('')
      break
  }
}

function removeProficieny(type: ProficiencyType, index: number) {
  switch(type) {
    case ProficiencyType.Language:
      selectedSheet.value.proficiencies.languages.splice(index, 1)
      break

    case ProficiencyType.Armor:
      selectedSheet.value.proficiencies.armor.splice(index, 1)
      break

    case ProficiencyType.Weapon:
      selectedSheet.value.proficiencies.weapons.splice(index, 1)
      break

    case ProficiencyType.Tool:
      selectedSheet.value.proficiencies.tools.splice(index, 1)
      break
  }
}

function getAc(): number {
    const armor = armorTypeAc.get(selectedSheet.value.armor.type)!
    const dexMod = getAbility('Dexterity').score.getModifier()

    return armor + dexMod + (selectedSheet.value.armor.shield ? 2 : 0)
}

function addAttack() {
  if(!selectedSheet.value.attacks) {
    selectedSheet.value.attacks = []
  }

  selectedSheet.value.attacks.push({
    damage: '',
    damageType: '',
    finesse: false,
    name: ''
  } as Attack)
}

function removeAttack(index: number) {
  selectedSheet.value.attacks.splice(index, 1)
}

function addEquipment() {
  if(!selectedSheet.value.equipment) {
    selectedSheet.value.equipment = []
  }

  selectedSheet.value.equipment.push({
    name: '',
    amount: 1
  } as Equipment)
}

function removeEquipment(index: number) {
  selectedSheet.value.equipment.splice(index, 1)
}

function addFeature() {
  if(!selectedSheet.value.features) {
    selectedSheet.value.features = []
  }
  selectedSheet.value.features.push({
    name: '',
    description: ''
  } as Feature)
}

function removeFeature(index: number) {
  selectedSheet.value.features.splice(index, 1)
}

function selectionChanged(payload: Event) {
  selectedSheet.value = sheets.value.find((sheet) => sheet.id == selectedSheetId.value)!
}

await loadSheetsAsync()
if(sheets.value.length != 0) {
  selectedSheet.value = sheets.value[0]
  selectedSheetId.value = selectedSheet.value.id!
} else {
  await newSheetAsync()
}
</script>

<template>
<div class="container">
  <div class="row hide-print">
    <div id="sheet-selection" class="cell row shrink">
      <select v-model="selectedSheetId" @change="selectionChanged">
        <option v-for="sheet in sheets" :value="sheet.id">{{ sheet.characterInfo?.name }}</option>
      </select>
      <button @click="addSheetAsync()">+</button>
      <button @click="deleteSheetAsync(selectedSheetId!)">-</button>
    </div>
    <div id="controls" class="cell row shrink button-group">
      <button @click="saveSheetAsync()">Save</button>
    </div>
    <!-- <div id="tab-buttons" class="cell row shrink button-group">
      <button @click="setActiveTab(Tab.Sheet)" :disabled="isActiveTab(Tab.Sheet)">Sheet</button>
      <button @click="setActiveTab(Tab.Notes)" :disabled="isActiveTab(Tab.Notes)">Notes</button>
    </div> -->
  </div>

  <div class="container" v-if="isActiveTab(Tab.Sheet)">
    <div class="row">
      <div class="column">
        <div class="character-info cell">
          <div>
            <div class="labeled-input">
                <span class="label">Player Name</span>
                <input type="text" v-model="selectedSheet.characterInfo.playerName">
            </div>
            <div class="labeled-input">
                <span class="label">Character Name</span>
                <input type="text" v-model="selectedSheet.characterInfo.name">
            </div>
            <div class="labeled-input">
                <span class="label">Class</span>
                <input type="text" v-model="selectedSheet.characterInfo.class">
            </div>
            <div class="labeled-input">
                <span class="label">Level</span>
                <input type="text" v-model="selectedSheet.characterInfo.level">
            </div>
          </div>
          <div>
            <div class="labeled-input">
                <span class="label">Race</span>
                <input type="text" v-model="selectedSheet.characterInfo.race">
            </div>
            <div class="labeled-input">
                <span class="label">Background</span>
                <input type="text" v-model="selectedSheet.characterInfo.background">
            </div>
            <div class="labeled-input">
              <span class="label">Alignment</span>
              <input type="text" v-model="selectedSheet.characterInfo.alignment">
            </div>
            <div class="labeled-input">
              <span class="label">Experience Points</span>
              <input type="text" v-model="selectedSheet.characterInfo!.experiencePoints">
            </div>
          </div>
        </div>
      </div>
    </div>
  
    <div class="row"> 
      <div id="ability-scores" class="column shrink">
        <div class="ability-score cell" v-for="(_, i) in selectedSheet.abilities">
            <span class="name">{{ selectedSheet.abilities[i].name }}</span>
            <span class="modifier">{{ selectedSheet.abilities[i].score.getModifier().formatModifier() }}</span>
            <input class="score" type="number" v-model="selectedSheet.abilities[i].score"/>
        </div>
      </div>
  
      <div id="column-1" class="column">
        <div id="inspiration" class="labeled-input cell">
          <span class="label">Inspiration</span>
          <input type="number" v-model="selectedSheet.general.inspiration">
        </div>
  
        <div id="proficiency-bonus" class="labeled-input cell">
          <span class="label">Proficiency Bonus</span>
          <input type="number" v-model="selectedSheet.general.proficiencyBonus">
        </div>
  
        <div id="saving-throws" class="column cell">
          <div class="saving-throw" v-for="(_, i) of selectedSheet.abilities">
            <input class="proficiency" type="checkbox" v-model="selectedSheet.abilities[i].proficiency"/>
            <span class="name">{{ selectedSheet.abilities[i].name }}</span>
            <span class="modifier">{{ (selectedSheet.abilities[i].score.getModifier() + (selectedSheet.abilities[i].proficiency ? selectedSheet.general.proficiencyBonus : 0)).formatModifier() }}</span>
          </div>
          <span class="column-label">Saving Throws</span>
        </div>
  
        <div id="skills" class="column cell">
          <div class="skill" v-for="(_, i) of selectedSheet.skills">
            <input class="proficency" type="checkbox" v-model="selectedSheet.skills[i].proficiency"/>
            <input class="expertise" type="checkbox" v-model="selectedSheet.skills[i].expertise"/>
            <span class="name">{{ selectedSheet.skills[i].name }}<span> ({{ getAbilityForSkill(selectedSheet.skills[i]).shortname }})</span></span>
            <span class="modifier">{{ (getAbilityForSkill(selectedSheet.skills[i]).score.getModifier() + (selectedSheet.skills[i].proficiency ? selectedSheet.general.proficiencyBonus * (selectedSheet.skills[i].expertise ? 2 : 1) : 0)).formatModifier()  }}</span>
          </div>
          <span class="column-label">Skills</span>
        </div>
  
        <div id="passive-wisdom" class="cell">
          <span class="label">Passive Wisdom (Perception)</span>
          <span class="score">{{ 10 + getAbility('Wisdom').score.getModifier() + (getSkill('Perception').proficiency ? selectedSheet.general.proficiencyBonus : 0) }}</span>
        </div>
  
        <div id="proficiencies" class="column cell">
          <div class="row">
            <div class="column">
              <div class="row">
                <span class="label">Lanuages</span>
                <button @click="addProficiency(ProficiencyType.Language)" class="add-button">+</button>
              </div>
              <div class="row">
                <div class="column">
                  <div class="item row" v-for="(_, i) in selectedSheet.proficiencies.languages">
                    <input type="text" v-model="selectedSheet.proficiencies.languages[i]">
                    <button class="remove" @click="removeProficieny(ProficiencyType.Language, i)">-</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <div class="row">
            <div class="column">
              <div class="row">
                <span class="label">Armor</span>
                <button @click="addProficiency(ProficiencyType.Armor)" class="add-button">+</button>
              </div>
              <div class="row">
                <div class="column">
                  <div class="item row" v-for="(_, i) in selectedSheet.proficiencies.armor">
                    <input type="text" v-model="selectedSheet.proficiencies.armor[i]">
                    <button class="remove" @click="removeProficieny(ProficiencyType.Armor, i)">-</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <div class="row">
            <div class="column">
              <div class="row">
                <span class="label">Weapons</span>
                <button @click="addProficiency(ProficiencyType.Weapon)" class="add-button">+</button>
              </div>
              <div class="row">
                <div class="column">
                  <div class="item row" v-for="(_, i) in selectedSheet.proficiencies.weapons">
                    <input type="text" v-model="selectedSheet.proficiencies.weapons[i]">
                    <button class="remove" @click="removeProficieny(ProficiencyType.Weapon, i)">-</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <div class="row">
            <div class="column">
              <div class="row">
                <span class="label">Tools</span>
                <button @click="addProficiency(ProficiencyType.Tool)" class="add-button">+</button>
              </div>
              <div class="row">
                <div class="column">
                  <div class="item row" v-for="(_, i) in selectedSheet.proficiencies.tools">
                    <input type="text" v-model="selectedSheet.proficiencies.tools[i]">
                    <button class="remove" @click="removeProficieny(ProficiencyType.Tool, i)">-</button>
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
              <select v-model="selectedSheet.armor.type">
                <option v-for="armorType in armorTypeAc.keys()" :key="armorType" :value="armorType">{{ armorType }}</option>
              </select>
              <input type="checkbox" v-model="selectedSheet.armor.shield"/>
            </div>
            <span class="score">{{ getAc() }}</span>
            <span class="label">Armor Class</span>
          </div>
  
          <div id="initiative" class="cell">
            <span class="score">{{ getAbility('Dexterity').score.getModifier().formatModifier() }}</span>
            <span class="label">Initiative</span>
          </div>
  
          <div id="speed" class="cell">
            <input type="number" class="score" v-model="selectedSheet.general.speed"/>
            <span class="label">Speed</span>
          </div>
        </div>
  
        <div class="row">
          <div id="hitpoint-maximum" class="cell">
            <input class="score" type="number" v-model="selectedSheet.healthPoints.maximum">
            <span class="label">Hitpoint Maximum</span>
          </div>
  
          <div id="current-hitpoints" class="cell">
            <input class="score" type="number" v-model="selectedSheet.healthPoints.current">
            <span class="label">Current hitpoints</span>
          </div>
  
          <div id="temporary-hitpoints" class="cell">
            <input class="score" type="number" v-model="selectedSheet.healthPoints.temporary">
            <span class="label">Temporary hitpoints</span>
          </div>
        </div>
  
        <div class="row">
          <div id="hit-dice-maximum" class="cell">
            <input type="text" class="score" v-model="selectedSheet.hitDice.max">
            <span class="label">Hit Dice Maximum</span>
          </div>
  
          <div id="hit-dice" class="cell">
            <input type="text" class="score" v-model="selectedSheet.hitDice.current">
            <span class="label">Hit Dice</span>
          </div>
  
          <div id="death-saves" class="cell">
            <table>
              <tr>
                <td>Successes</td>
                <td class="row">
                  <input type="checkbox" v-for="(_, i) in selectedSheet.deathSave.success" :key="`death-save-success-${i}`" v-model="selectedSheet.deathSave.success[i]">
                </td>
              </tr>
              <tr>
                <td>Failures</td>
                <td class="row">
                  <input type="checkbox" v-for="(_, i) in selectedSheet.deathSave.failure" :key="`death-save-failure-${i}`" v-model="selectedSheet.deathSave.failure[i]">
                </td>
              </tr>
            </table>
          <span class="label">Death Saves</span>
          </div>
        </div>
  
        <div id="attacks" class="row cell">
          <div class="column">
            <div class="row add-button">
              <button @click="addAttack()">+</button>
            </div>
            <div class="row">
              <div class="column">
                <div class="attack row" v-for="(attack, i) in selectedSheet.attacks" :key="`attack-${i}`">
                  <input type="checkbox" v-model="attack.finesse">
                  <input class="name" type="text" v-model="attack.name">
                  <span class="attack-bonus">{{ (selectedSheet.general.proficiencyBonus + (attack.finesse ? getAbility('Dexterity').score.getModifier() : getAbility('Strength').score.getModifier())).formatModifier() }}</span>
                  <input class="damage" type="text" v-model="attack.damage">
                  <span class="bonus-damage">{{ (attack.finesse ? getAbility('Dexterity').score.getModifier() : getAbility('Strength').score.getModifier()).formatModifier() }}</span>
                  <input class="damage-type" type="text" v-model="attack.damageType">
                  <button class="remove" @click="removeAttack(i)">-</button>
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
                 <input type="number" v-model="selectedSheet.currency.copper">
                </div>
                <div class="row">
                  <span class="label">SP</span>
                  <input type="number" v-model="selectedSheet.currency.silver">
                </div>
                <div class="row">
                  <span class="label">EP</span>
                  <input type="number" v-model="selectedSheet.currency.electrum">
                </div>
                <div class="row">
                  <span class="label">GP</span>
                  <input type="number" v-model="selectedSheet.currency.gold">
                </div>
                <div class="row">
                  <span class="label">PP</span>
                  <input type="number" v-model="selectedSheet.currency.platinum">
                </div>
              </div>
              <div id="equipment" class="column">
                <div class="row">
                  <div class="column">
                    <div class="header">
                      <span class="name">Name</span>
                      <span class="amount">Amount</span>
                      <button @click="addEquipment()">+</button>
                    </div>
                    <div class="equipment-item" v-for="(item, i) in selectedSheet.equipment" :key="`equipment-item-${i}`">
                      <input class="name" type="text" v-model="selectedSheet.equipment[i].name">
                      <input class="amount" type="number" v-model="selectedSheet.equipment[i].amount">
                      <button class="remove" @click="removeEquipment(i)">-</button>
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
              <textarea v-model="selectedSheet.pibf.personalityTraits"></textarea>
              <span class="label">Personality Traits</span>
            </div>
          </div>
          <div class="row">
            <div class="cell">
              <textarea v-model="selectedSheet.pibf.ideals"></textarea>
              <span class="label">Ideals</span>
            </div>
          </div>
          <div class="row">
            <div class="cell">
              <textarea v-model="selectedSheet.pibf.bonds"></textarea>
              <span class="label">Bonds</span>
            </div>
          </div>
          <div class="row">
            <div class="cell">
              <textarea v-model="selectedSheet.pibf.flaws"></textarea>
              <span class="label">Flaws</span>
            </div>
          </div>
        </div>
  
        <div id="features" class="row cell">
          <div class="column">
            <div class="row add-button">
              <button @click="addFeature()">+</button>
            </div>
            <div class="row">
              <div class="column">
                <div class="item column" v-for="(item, i) in selectedSheet.features" :key="`item-${i}`">
                  <div class="row">
                    <input class="name" type="text" v-model="item.name">
                    <button @click="removeFeature(i)">-</button>
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

  <!-- <div class="container" v-if="isActiveTab(Tab.Notes)">
    <div class="column">
      <div class="row">
        <div id="notes" class="row">
          <div class="cell column note-titles">
            <button class="row">Add note</button>
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
  </div> -->
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
