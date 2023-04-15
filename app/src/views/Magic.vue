<script setup lang="ts">
import store from '@/store'
import { SpellcastingAbilityNames } from '@/models'
import '@/extensions'
import { textAreaResize } from '@/textarea-resize'
import math from '@/math'
textAreaResize()

await store.initAsync()
</script>

<template>
  <column>
    <row>
      <cell row shrink>
        <column>
          <row>
            <span>Spellcasting Class</span>
          </row>
          <row>
            <input type="text" v-model="store.selectedSheet.magic.spellCastingClass" />
          </row>
        </column>

        <column>
          <row>
            <span>Spellcasting Ability</span>
          </row>
          <row>
            <column>
              <select v-model="store.selectedSheet.magic.spellCastingAbility">
                <option v-for="ability in SpellcastingAbilityNames" :value="ability">{{ ability }}</option>
              </select>
            </column>
            <column>
              <span>
                {{ math.calculateSpellCastingAbilityModifier().formatModifier() }}
              </span>
            </column>
          </row>
        </column>

        <column>
          <row>
            <span>Spell Save DC</span>
          </row>
          <row>
            <span>{{ math.calculateSpellSaveDC() }}</span>
          </row>
        </column>

        <column>
          <row>
            <span>Spell Attack Bonus</span>
          </row>
          <row>
            <span>{{ math.calculateSpellAttackBonus().formatModifier() }}</span>
          </row>
        </column>
      </cell>
    </row>

    <row v-for="(_, i) in 2">
      <column grow v-for="section in store.selectedSheet.magic.sections.slice(i * 5, 5 + i * 5)">
        <cell>
          <row>
            <column>
              <row font-size="1.5">
                <span v-if="section.level == 0">Cantrips</span>
                <span v-else>Level {{ section.level }}</span>
              </row>
            </column>
            <column shrink>
              <row>
                <button @click="store.addSpell(section.level)">+</button>
              </row>
            </column>
          </row>
          <row v-if="section.level > 0">
            <column shrink>
              Slots
            </column>
            <column>
              <input type="number" v-model="section.slotsMaximum">
            </column>
            <column shrink>
              Current
            </column>
            <column>
              <input type="number" v-model="section.currentSlots">
            </column>
          </row>
          <row></row>
          <row grow>
            <column>
              <row v-for="(spell, i) of section.spells">
                <column>
                  <row>
                    <column>
                      <input font-size="1.5" type="text" v-model="spell.name">
                    </column>
                    <column shrink>
                      <button font-size="1.5" shrink @click="store.removeSpell(section.level, i)">-</button>
                    </column>
                  </row>

                  <row>
                    <column v-if="section.level > 0">
                      <row>
                        <input type="checkbox" v-model="spell.prepared"><span>Prepared</span>
                      </row>
                      <row>
                        <input type="checkbox" v-model="spell.ritual"><span>Ritual</span>
                      </row>
                    </column>
                    <column v-else></column>
                    <column shrink>
                      <row>
                        <column center>V</column>
                        <column center>S</column>
                        <column center>M</column>
                      </row>
                      <row>
                        <column>
                          <input shrink type="checkbox" v-model="spell.vsm.v">
                        </column>
                        <column>
                          <input shrink type="checkbox" v-model="spell.vsm.s">
                        </column>
                        <column>
                          <input shrink type="checkbox" v-model="spell.vsm.m">
                        </column>
                      </row>
                    </column>
                  </row>

                  <row>
                    <column>
                      <row>
                        <span>Casting Time</span>
                      </row>
                      <row>
                        <input type="text" v-model="spell.castingTime">
                      </row>
                    </column>

                    <column>
                      <row>
                        <span>Range</span>
                      </row>
                      <row>
                        <input type="text" v-model="spell.range">
                      </row>
                    </column>
                  </row>

                  <row>
                    <column>
                      <row>
                        <span>Duration</span>
                      </row>
                      <row>
                        <input type="text" v-model="spell.duration">
                      </row>
                    </column>

                    <column>
                      <row>
                        <span>Effect/Damage</span>
                      </row>
                      <row>
                        <input type="text" v-model="spell.effect">
                      </row>
                    </column>
                  </row>

                  <row>
                    <textarea v-model="spell.description"></textarea>
                  </row>
                  <row></row>
                </column>
              </row>
            </column>
          </row>
        </cell>
      </column>
    </row>
  </column>
</template>