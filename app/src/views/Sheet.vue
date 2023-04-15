<script setup lang="ts">
import { SkillToAbility, type Ability, type Skill, ProficiencyType, ArmorTypeAc } from '@/models'
import store from '@/store'
import '@/extensions'
import { textAreaResize } from '@/textarea-resize'
import math from '@/math'
textAreaResize()

await store.initAsync()

function getAbilityForSkill(skill: Skill): Ability {
  return store.selectedSheet.abilities.find((x: Ability) => x.name === SkillToAbility.get(skill.name))!
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
            <input type="text" v-model="store.selectedSheet.characterInfo.playerName">
          </row>
        </column>

        <column>
          <row>
            <span>Character Name</span>
          </row>
          <row>
            <input type="text" v-model="store.selectedSheet.characterInfo.name">
          </row>
        </column>

        <column>
          <row>
            <span>Class</span>
          </row>
          <row>
            <input type="text" v-model="store.selectedSheet.characterInfo.class">
          </row>
        </column>

        <column>
          <row>
            <span>Level</span>
          </row>
          <row>
            <input type="number" v-model="store.selectedSheet.characterInfo.level">
          </row>
        </column>

        <column>
          <row>
            <span>Race</span>
          </row>
          <row>
            <input type="text" v-model="store.selectedSheet.characterInfo.race">
          </row>
        </column>

        <column>
          <row>
            <span>Background</span>
          </row>
          <row>
            <input type="text" v-model="store.selectedSheet.characterInfo.background">
          </row>
        </column>

        <column>
          <row>
            <span>Alignment</span>
          </row>
          <row>
            <input type="text" v-model="store.selectedSheet.characterInfo.alignment">
          </row>
        </column>

        <column>
          <row>
            <span>Experience Points</span>
          </row>
          <row>
            <input type="number" v-model="store.selectedSheet.characterInfo.experiencePoints">
          </row>
        </column>
      </cell>
    </row>

    <row>
      <column shrink>
        <row v-for="ability in store.selectedSheet.abilities" :key="ability.name">
          <cell>
            <span center>{{ ability.name }}</span>
            <span center font-size="1.5">{{ math.calculateAbilityModifier(ability).formatModifier() }}</span>
            <input type="number" :id="`ability-${ability.name}`" center v-model="ability.score" />
          </cell>
        </row>
      </column>

      <column>
        <row>
          <cell row>
            <label for="inspiration" grow>Inspiration</label>
            <input type="number" id="inspiration" center width="3" v-model="store.selectedSheet.general.inspiration" />
          </cell>
        </row>

        <row>
          <cell row>
            <label for="proficiency-bonus" grow>Proficiency Bonus</label>
            <input type="number" id="proficiency-bonus" center width="3"
              v-model="store.selectedSheet.general.proficiencyBonus" />
          </cell>
        </row>

        <row>
          <cell>
            <row>
              <column width="1.5" center>P</column>
              <column grow></column>
            </row>
            <row v-for="ability in store.selectedSheet.abilities" :key="ability.name">
              <column shrink>
                <input type="checkbox" v-model="ability.proficiency">
              </column>
              <column grow>
                <span>{{ ability.name }}</span>
              </column>
              <column shrink right>
                <span>{{ math.calculateAbilitySavingThrowModifier(ability).formatModifier() }}</span>
              </column>
            </row>
            <footer>Saving Throws</footer>
          </cell>
        </row>

        <row>
          <cell>
            <row>
              <column width="1.5" margin-right="0.8" center>P</column>
              <column width="1.5" center>E</column>
              <column grow></column>
            </row>
            <row v-for="skill in store.selectedSheet.skills" :key="skill.name">
              <column shrink>
                <input type="checkbox" v-model="skill.proficiency">
              </column>
              <column shrink>
                <input type="checkbox" v-model="skill.expertise">
              </column>
              <column grow>
                <span>{{ skill.name }} ({{ getAbilityForSkill(skill).name.substring(0, 3) }})</span>
              </column>
              <column shrink right>
                <span>{{ math.calculateSkillModifier(skill).formatModifier() }}</span>
              </column>
            </row>
            <footer>Skills</footer>
          </cell>
        </row>

        <row>
          <cell row>
            <span grow>Passive Wisdom (Perception)</span>
            <span>{{ math.calculatePassiveWisdom().formatModifier() }}</span>
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
                <row v-for="(proficiency, i) of store.getProficiencies(proficiencyType)">
                  <input type="text" margin-right="0.5" :value="proficiency"
                    @input="e => store.setProficiency(proficiencyType, i, e.target.value)">
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
                <span center grow font-size="3">{{ math.calculateAC() }}</span>
              </row>
              <footer>Armor Class</footer>
            </cell>
          </column>

          <column>
            <cell>
              <row grow>
                <column grow style="justify-content: center;">
                  <span center font-size="3">{{ math.calculateInitiative().formatModifier() }}</span>
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
                <input type="checkbox" v-for="(_, i) in store.selectedSheet.deathSave.success"
                  v-model="store.selectedSheet.deathSave.success[i]">
              </row>
              <row grow>
                <span grow>Failure</span>
                <input type="checkbox" v-for="(_, i) in store.selectedSheet.deathSave.failure"
                  v-model="store.selectedSheet.deathSave.failure">
              </row>
              <footer>Death saves</footer>
            </cell>
          </column>
        </row>

        <row>
          <cell>
            <row>
              <column width="1.5" margin-right="0.8" center>P</column>
              <column width="1.5" center>F</column>
              <column grow></column>
              <column shrink>
                <button @click="store.addAttack()">+</button>
              </column>
            </row>
            <row v-for="(attack, i) in store.selectedSheet.attacks">
              <column shrink>
                <input type="checkbox" v-model="attack.proficiency">
              </column>
              <column shrink>
                <input type="checkbox" v-model="attack.finesse">
              </column>
              <column>
                <input type="text" margin-right="0.5" v-model="attack.name" placeholder="Name">
              </column>
              <column shrink>
                <span margin-right="0.5">{{ math.calculateAttackRoll(attack).formatModifier() }}</span>
              </column>
              <column shrink>
                <input type="text" center margin-right="0.5" v-model="attack.damage" placeholder="Damage">
              </column>
              <column shrink>
                <span margin-right="0.5">{{ math.calculateAttackModifier(attack).formatModifier() }}</span>
              </column>
              <column shrink>
                <input type="text" center v-model=attack.damageType placeholder="Type">
              </column>
              <column shrink>
                <button @click="store.removeAttack(i)">-</button>
              </column>
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
                  <input type="number" center width="4" v-model="store.selectedSheet.currency.copper">
                </row>
                <row>
                  <span margin-right="0.5">SP</span>
                  <input type="number" center width="4" v-model="store.selectedSheet.currency.silver">
                </row>
                <row>
                  <span margin-right="0.5">EP</span>
                  <input type="number" center width="4" v-model="store.selectedSheet.currency.electrum">
                </row>
                <row>
                  <span margin-right="0.5">GP</span>
                  <input type="number" center width="4" v-model="store.selectedSheet.currency.gold">
                </row>
                <row>
                  <span margin-right="0.5">PP</span>
                  <input type="number" center width="4" v-model="store.selectedSheet.currency.platinum">
                </row>
              </column>
              <column grow>
                <row>
                  <span grow>Name</span>
                  <span width="4">Amount</span>
                  <button @click="store.addEquipment()">+</button>
                </row>
                <row v-for="(equipment, i) of store.selectedSheet.equipment">
                  <input type="text" grow margin-right="0.5" v-model="equipment.name" placeholder="Name">
                  <input type="number" width="4" margin-right="0.5" v-model="equipment.amount" placeholder="Amount">
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