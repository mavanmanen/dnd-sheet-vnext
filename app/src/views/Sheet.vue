<script setup lang="ts">
import { ref } from 'vue'
import { SkillToAbility, AbilityNames, SkillNames, type Ability, type Skill, type Attack, ProficiencyType, ArmorTypeAc } from '@/models'
import store from '@/store'
import '@/extensions'
import { textAreaResize } from '@/textarea-resize'
textAreaResize()

await store.initAsync()

let characterInfo = ref(store.selectedSheet.characterInfo)
let general = ref(store.selectedSheet.general)
let deathSave = ref(store.selectedSheet.deathSave)
let currency = ref(store.selectedSheet.currency)
let parameters = ref(store.selectedSheet.parameters)

function getSavingThrowModifier(ability: Ability): number {
  return getAbilityModifier(ability) + (ability.proficiency ? general.value.proficiencyBonus : 0)
}

function getAbilityForSkill(skill: Skill): Ability {
  return store.selectedSheet.abilities.find((x: Ability) => x.name === SkillToAbility.get(skill.name))!
}

function getAbilityModifier(ability: Ability): number {
  return ability.score.getModifier() + parameters.value.get(ability.name)!
}

function getSkillModifier(skill: Skill): number {
  return getAbilityModifier(getAbilityForSkill(skill)) + (skill.proficiency ? general.value.proficiencyBonus + (skill.expertise ? general.value.proficiencyBonus : 0) : 0) + parameters.value.get(skill.name)!
}

function getSkill(name: string): Skill {
  return store.selectedSheet.skills.find((x: Skill) => x.name === name)!
}

function getPassiveWisdom(): number {
  return 10 + getAbilityModifier(store.getAbility(AbilityNames.Wisdom)) + (getSkill(SkillNames.Perception).proficiency ? general.value.proficiencyBonus : 0)
}

function getProficiencies(proficiency: ProficiencyType) {
  switch (proficiency) {
    case ProficiencyType.Armor: return store.selectedSheet.proficiencies.armor
    case ProficiencyType.Languages: return store.selectedSheet.proficiencies.languages
    case ProficiencyType.Tools: return store.selectedSheet.proficiencies.tools
    case ProficiencyType.Weapons: return store.selectedSheet.proficiencies.weapons
  }
}

function setProficiency(proficiency: ProficiencyType, index: number, event: InputEvent) {
  // @ts-ignore
  const value = event.target!.value
  switch (proficiency) {
    case ProficiencyType.Armor:
      store.selectedSheet.proficiencies.armor[index] = value
      break

    case ProficiencyType.Languages:
      store.selectedSheet.proficiencies.languages[index] = value
      break

    case ProficiencyType.Tools:
      store.selectedSheet.proficiencies.tools[index] = value
      break

    case ProficiencyType.Weapons:
      store.selectedSheet.proficiencies.weapons[index] = value
      break
  }
}

function getAc(): number {
  const armor = ArmorTypeAc.get(store.selectedSheet.armor.type)!
  const dexMod = store.getAbility(AbilityNames.Dexterity).score.getModifier()

  return armor + dexMod + (store.selectedSheet.armor.shield ? 2 : 0) + parameters.value.get('AC')!
}

function getInitiative(): number {
  return getAbilityModifier(store.getAbility(AbilityNames.Dexterity)) + parameters.value.get('Initiative')!
}

function getAttackModifier(attack: Attack): number {
  return attack.finesse ? getAbilityModifier(store.getAbility(AbilityNames.Dexterity)) : getAbilityModifier(store.getAbility(AbilityNames.Strength))
}

function getAttackRoll(attack: Attack): number {
  return (attack.proficiency ? general.value.proficiencyBonus : 0) + getAttackModifier(attack)
}
</script>

<template>
  <column>
    <row>
      <cell row>
        <column>
          <row>
            <span>Player Name</span>
          </row>
          <row>
            <input type="text" v-model="characterInfo.playerName">
          </row>
        </column>

        <column>
          <row>
            <span>Character Name</span>
          </row>
          <row>
            <input type="text" v-model="characterInfo.name">
          </row>
        </column>

        <column>
          <row>
            <span>Class</span>
          </row>
          <row>
            <input type="text" v-model="characterInfo.playerName">
          </row>
        </column>

        <column>
          <row>
            <span>Level</span>
          </row>
          <row>
            <input type="number" v-model="characterInfo.level">
          </row>
        </column>

        <column>
          <row>
            <span>Race</span>
          </row>
          <row>
            <input type="text" v-model="characterInfo.race">
          </row>
        </column>

        <column>
          <row>
            <span>Background</span>
          </row>
          <row>
            <input type="text" v-model="characterInfo.background">
          </row>
        </column>

        <column>
          <row>
            <span>Alignment</span>
          </row>
          <row>
            <input type="text" v-model="characterInfo.alignment">
          </row>
        </column>

        <column>
          <row>
            <span>Experience Points</span>
          </row>
          <row>
            <input type="number" v-model="characterInfo.experiencePoints">
          </row>
        </column>
      </cell>
    </row>

    <row>
      <column shrink>
        <row v-for="ability in store.selectedSheet.abilities" :key="ability.name">
          <cell>
            <span center>{{ ability.name }}</span>
            <span center font-size="1.5">{{ getAbilityModifier(ability).formatModifier() }}</span>
            <input type="number" :id="`ability-${ability.name}`" center v-model="ability.score" />
          </cell>
        </row>
      </column>

      <column>
        <row>
          <cell row>
            <label for="inspiration" grow>Inspiration</label>
            <input type="number" id="inspiration" center width="3" v-model="general.inspiration" />
          </cell>
        </row>

        <row>
          <cell row>
            <label for="proficiency-bonus" grow>Proficiency Bonus</label>
            <input type="number" id="proficiency-bonus" center width="3" v-model="general.proficiencyBonus" />
          </cell>
        </row>

        <row>
          <cell>
            <row v-for="ability in store.selectedSheet.abilities" :key="ability.name">
              <input type="checkbox" v-model="ability.proficiency">
              <span grow>{{ ability.name }}</span>
              <span>{{ getSavingThrowModifier(ability).formatModifier() }}</span>
            </row>
            <footer>Saving Throws</footer>
          </cell>
        </row>

        <row>
          <cell>
            <row v-for="skill in store.selectedSheet.skills" :key="skill.name">
              <input type="checkbox" v-model="skill.proficiency">
              <input type="checkbox" v-model="skill.expertise">
              <span grow>{{ skill.name }} ({{ getAbilityForSkill(skill).name.substring(0, 3) }})</span>
              <span>{{ getSkillModifier(skill).formatModifier() }}</span>
            </row>
            <footer>Skills</footer>
          </cell>
        </row>

        <row>
          <cell row>
            <span grow>Passive Wisdom (Perception)</span>
            <span>{{ getPassiveWisdom().formatModifier() }}</span>
          </cell>
        </row>

        <row>
          <cell>
            <row v-for="proficiencyType in ProficiencyType">
              <column>
                <row>
                  <span grow>{{ proficiencyType }}</span>
                  <button @click="store.addProficiency(proficiencyType)">+</button>
                </row>
                <row v-for="(proficiency, i) of getProficiencies(proficiencyType)">
                  <input type="text" margin-right="0.5" :value="proficiency"
                    @input="e => setProficiency(proficiencyType, i, e as InputEvent)">
                  <button @click="store.removeProficieny(proficiencyType, i)">-</button>
                </row>
                <row></row>
              </column>
            </row>
            <footer>Proficiencies</footer>
          </cell>
        </row>
      </column>

      <column>
        <row>
          <column>
            <cell>
              <row grow>
                <select v-model="store.selectedSheet.armor.type" grow>
                  <option v-for="armorType in ArmorTypeAc.keys()" :value="armorType">{{ armorType }}</option>
                </select>
              </row>
              <row>
                <input type="checkbox" v-model="store.selectedSheet.armor.shield">Shield
              </row>
              <row>
                <span center grow font-size="3">{{ getAc() }}</span>
              </row>
              <footer>Armor Class</footer>
            </cell>
          </column>

          <column>
            <cell>
              <row grow>
                <column grow style="justify-content: center;">
                  <span center font-size="3">{{ getInitiative().formatModifier() }}</span>
                </column>
              </row>
              <footer>Initiative</footer>
            </cell>
          </column>

          <column>
            <cell>
              <row grow>
                <input type="number" center grow font-size="3" v-model="store.selectedSheet.general.speed">
              </row>
              <footer>Speed</footer>
            </cell>
          </column>
        </row>

        <row>
          <column>
            <cell>
              <row grow>
                <input type="number" center grow font-size="3" v-model="store.selectedSheet.healthPoints.maximum">
              </row>
              <footer>Hitpoint Maximum</footer>
            </cell>
          </column>

          <column>
            <cell>
              <row grow>
                <input type="number" center grow font-size="3" v-model="store.selectedSheet.healthPoints.current">
              </row>
              <footer>Current Hitpoints</footer>
            </cell>
          </column>

          <column>
            <cell>
              <row grow>
                <input type="number" center grow font-size="3" v-model="store.selectedSheet.healthPoints.temporary">
              </row>
              <footer>Temporary Hitpoints</footer>
            </cell>
          </column>
        </row>

        <row>
          <column>
            <cell>
              <row grow>
                <input type="text" center grow font-size="3" v-model="store.selectedSheet.hitDice.max">
              </row>
              <footer>Hit Dice Maximum</footer>
            </cell>
          </column>

          <column>
            <cell>
              <row grow>
                <input type="text" center grow font-size="3" v-model="store.selectedSheet.hitDice.current">
              </row>
              <footer>Current Hit Dice</footer>
            </cell>
          </column>

          <column>
            <cell>
              <row grow>
                <span grow>Success</span>
                <input type="checkbox" v-for="(_, i) in deathSave.success" v-model="deathSave.success[i]">
              </row>
              <row grow>
                <span grow>Failure</span>
                <input type="checkbox" v-for="(_, i) in deathSave.failure" v-model="deathSave.failure">
              </row>
              <footer>Death saves</footer>
            </cell>
          </column>
        </row>

        <row>
          <cell>
            <row>
              <span grow></span>
              <button @click="store.addAttack()">+</button>
            </row>
            <row v-for="attack in store.selectedSheet.attacks">
              <input type="checkbox" v-model="attack.proficiency">
              <input type="checkbox" v-model="attack.finesse">
              <input type="text" margin-right="0.5" v-model="attack.name">
              <span margin-right="0.5">{{ getAttackRoll(attack).formatModifier() }}</span>
              <input type="text" center width="4" margin-right="0.5" v-model="attack.damage">
              <span margin-right="0.5">{{ getAttackModifier(attack).formatModifier() }}</span>
              <button>-</button>
            </row>
            <footer>Attacks</footer>
          </cell>
        </row>

        <row>
          <cell>
            <row>
              <column shrink style="align-self: flex-start;">
                <row>
                  <span margin-right="0.5">CP</span>
                  <input type="number" center width="4" v-model="currency.copper">
                </row>
                <row>
                  <span margin-right="0.5">SP</span>
                  <input type="number" center width="4" v-model="currency.silver">
                </row>
                <row>
                  <span margin-right="0.5">EP</span>
                  <input type="number" center width="4" v-model="currency.electrum">
                </row>
                <row>
                  <span margin-right="0.5">GP</span>
                  <input type="number" center width="4" v-model="currency.gold">
                </row>
                <row>
                  <span margin-right="0.5">PP</span>
                  <input type="number" center width="4" v-model="currency.platinum">
                </row>
              </column>
              <column grow>
                <row>
                  <span grow>Name</span>
                  <span width="4">Amount</span>
                  <button @click="store.addEquipment()">+</button>
                </row>
                <row v-for="(equipment, i) of store.selectedSheet.equipment">
                  <input type="text" grow margin-right="0.5" v-model="equipment.name">
                  <input type="number" width="4" margin-right="0.5" v-model="equipment.amount">
                  <button @click="store.removeEquipment(i)">-</button>
                </row>
              </column>
            </row>
            <footer>Currency & Equipment</footer>
          </cell>
        </row>
      </column>

      <column>
        <row>
          <cell>
            <textarea v-model="store.selectedSheet.pibf.personalityTraits"></textarea>
            <footer>Personality Traits</footer>
          </cell>
        </row>

        <row>
          <cell>
            <textarea v-model="store.selectedSheet.pibf.ideals"></textarea>
            <footer>Ideals</footer>
          </cell>
        </row>

        <row>
          <cell>
            <textarea v-model="store.selectedSheet.pibf.bonds"></textarea>
            <footer>Bonds</footer>
          </cell>
        </row>

        <row>
          <cell>
            <textarea v-model="store.selectedSheet.pibf.flaws"></textarea>
            <footer>Flaws</footer>
          </cell>
        </row>

        <row>
          <cell>
            <row>
              <span grow></span>
              <button @click="store.addFeature()">+</button>
            </row>
            <row v-for="(feature, i) of store.selectedSheet.features">
              <column>
                <row>
                  <input type="text" margin-right="0.5" v-model="feature.name">
                  <button @click="store.removeFeature(i)">-</button>
                </row>
                <row>
                  <textarea v-model="feature.description"></textarea>
                </row>
              </column>
            </row>
            <footer>Features</footer>
          </cell>
        </row>
      </column>
    </row>
  </column>
</template>