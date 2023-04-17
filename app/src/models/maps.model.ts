import type { ArmorDefinition } from './armor-definition.model'
import { AbilityNames, ArmorClass, SkillNames } from './enums.model'

export const SkillToAbility = new Map<string, string>([
  [SkillNames.Acrobatics, AbilityNames.Dexterity],
  [SkillNames.AnimalHandling, AbilityNames.Wisdom],
  [SkillNames.Arcana, AbilityNames.Intelligence],
  [SkillNames.Athletics, AbilityNames.Strength],
  [SkillNames.Deception, AbilityNames.Charisma],
  [SkillNames.History, AbilityNames.Intelligence],
  [SkillNames.Insight, AbilityNames.Wisdom],
  [SkillNames.Intimidation, AbilityNames.Charisma],
  [SkillNames.Investigation, AbilityNames.Intelligence],
  [SkillNames.Medicine, AbilityNames.Wisdom],
  [SkillNames.Nature, AbilityNames.Intelligence],
  [SkillNames.Perception, AbilityNames.Wisdom],
  [SkillNames.Performance, AbilityNames.Charisma],
  [SkillNames.Persuasion, AbilityNames.Charisma],
  [SkillNames.Religion, AbilityNames.Intelligence],
  [SkillNames.SleightOfHand, AbilityNames.Dexterity],
  [SkillNames.Stealth, AbilityNames.Dexterity],
  [SkillNames.Survival, AbilityNames.Wisdom]
])

export const ArmorTypeAc = new Map<string, ArmorDefinition>([
  ['Padded', { class: ArmorClass.Light, ac: 11, stealthDisadvantage: true }],
  ['Leather', { class: ArmorClass.Light, ac: 11, stealthDisadvantage: false }],
  ['Studded Leather', { class: ArmorClass.Light, ac: 12, stealthDisadvantage: false }],
  ['Hide', { class: ArmorClass.Medium, ac: 12, stealthDisadvantage: false }],
  ['Chain Shirt', { class: ArmorClass.Medium, ac: 13, stealthDisadvantage: false }],
  ['Scale Mail', { class: ArmorClass.Medium, ac: 14, stealthDisadvantage: true }],
  ['Breastplate', { class: ArmorClass.Medium, ac: 14, stealthDisadvantage: false }],
  ['Half Plate', { class: ArmorClass.Medium, ac: 15, stealthDisadvantage: true }],
  ['Ring Mail', { class: ArmorClass.Heavy, ac: 14, stealthDisadvantage: true }],
  ['Chain Mail', { class: ArmorClass.Heavy, ac: 16, stealthDisadvantage: true }],
  ['Splint', { class: ArmorClass.Heavy, ac: 17, stealthDisadvantage: true }],
  ['Plate', { class: ArmorClass.Heavy, ac: 18, stealthDisadvantage: true }]
])
