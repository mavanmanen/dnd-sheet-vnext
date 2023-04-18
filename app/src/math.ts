import store from '@/store'
import {
  type Ability,
  type Skill,
  type Attack,
  AbilityNames,
  SkillNames,
  ArmorTypeAc,
  SkillToAbility,
  ArmorClass
} from '@/models'

function getParameter(name: string): number {
  return store.selectedSheet.parameters.get(name)!
}

function getAbilityByName(name: string): Ability {
  return store.selectedSheet.abilities.find(a => a.name == name)!
}

function getSkillByName(name: string): Skill {
  return store.selectedSheet.skills.find(s => s.name == name)!
}

function getAbilityForSkill(skill: Skill): Ability {
  return store.selectedSheet.abilities.find(a => a.name == SkillToAbility.get(skill.name))!
}

// (score - 10) / 2
function calculateModifier(score: number): number {
  return Math.floor((score - 10) / 2)
}

// mod
function calculateAbilityModifier(ability: Ability): number {
  let base = calculateModifier(ability.score)
  return base + getParameter(ability.name)
}

// abilityMod + proficiencyBonus (if proficient)
function calculateAbilitySavingThrowModifier(ability: Ability): number {
  let base = calculateAbilityModifier(ability)
  if (ability.proficiency) {
    base += store.selectedSheet.general.proficiencyBonus
  }
  return base
}

// abilityMod + proficiencyBonus (if proficient, * 2 if expertise)
function calculateSkillModifier(skill: Skill): number {
  let base = calculateAbilityModifier(getAbilityForSkill(skill))
  if (skill.proficiency) {
    let bonus = store.selectedSheet.general.proficiencyBonus
    if (skill.expertise) {
      bonus *= 2
    }
    base += bonus
  }
  return base + getParameter(skill.name)
}

// 10 + wisdom + perception (if proficient)
function calculatePassiveWisdom(): number {
  const wisdom = getAbilityByName(AbilityNames.Wisdom)
  const perception = getSkillByName(SkillNames.Perception)
  let base = 10 + calculateAbilityModifier(wisdom)
  if (perception.proficiency) {
    base += calculateSkillModifier(perception)
  }
  return base
}

// armorAc + dexterity (light armor & max +2 if medium armor) + 2 (if shield)
function calculateAC(): number {
  const armor = ArmorTypeAc.get(store.selectedSheet.armor.type)!
  const dexterity = calculateAbilityModifier(getAbilityByName(AbilityNames.Dexterity))
  let base = armor.ac

  switch (armor.class) {
    case ArmorClass.Light:
      base += dexterity
      break

    case ArmorClass.Medium:
      base += Math.min(2, dexterity)
      break
  }

  if (store.selectedSheet.armor.shield) {
    base += 2
  }

  return base + getParameter('AC')
}

// dexterity
function calculateInitiative(): number {
  const dexterity = getAbilityByName(AbilityNames.Dexterity)
  let base = calculateAbilityModifier(dexterity)
  return base + getParameter('Initiative')
}

// strength, dexterity if finesse
function calculateAttackModifier(attack: Attack): number {
  const ability = getAbilityByName(attack.ability)
  let base = calculateAbilityModifier(ability)
  return base
}

// attackMod + proficiencyBonus (if proficient)
function calculateAttackRoll(attack: Attack): number {
  let base = calculateAttackModifier(attack)
  if (attack.proficiency) {
    base += store.selectedSheet.general.proficiencyBonus
  }
  return base
}

// modifier of spellcasting ability
function calculateSpellCastingAbilityModifier(): number {
  const spellCastingAbility = getAbilityByName(store.selectedSheet.magic.spellCastingAbility)
  let base = calculateAbilityModifier(spellCastingAbility)
  return base + getParameter(spellCastingAbility.name)
}

// spellcasting ability modifier + proficiencyBonus
function calculateSpellAttackBonus(): number {
  let base = calculateSpellCastingAbilityModifier()
  base += store.selectedSheet.general.proficiencyBonus
  return base + getParameter('Spell Attack Bonus')
}

// 8 + spell attack bonus
function calculateSpellSaveDC(): number {
  let base = 8 + calculateSpellAttackBonus()
  return base + getParameter('Spell Save DC')
}

export default {
  calculateAC,
  calculateAbilityModifier,
  calculateAttackModifier,
  calculateAttackRoll,
  calculateInitiative,
  calculateModifier,
  calculatePassiveWisdom,
  calculateSkillModifier,
  calculateSpellAttackBonus,
  calculateSpellCastingAbilityModifier,
  calculateSpellSaveDC,
  calculateAbilitySavingThrowModifier
}