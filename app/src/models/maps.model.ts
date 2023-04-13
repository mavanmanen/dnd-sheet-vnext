import { AbilityNames, SkillNames } from "./enums.model"

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

export const ArmorTypeAc = new Map<string, number>([
  ['Padded', 11],
  ['Leather', 11],
  ['Studded Leather', 12],
  ['Hide', 12],
  ['Chain Shirt', 13],
  ['Scale Mail', 14],
  ['Breastplate', 14],
  ['Ring Mail', 14],
  ['Half Plate', 15],
  ['Chain Mail', 16],
  ['Splint', 17],
  ['Plate', 18]
])
