import { AbilityNames } from "./ability-names.model";
import { SkillNames } from "./skill-names.model";

export class SkillAbilityTable {
    public static Mapping: Map<SkillNames, AbilityNames> = new Map<SkillNames, AbilityNames>([
        [ SkillNames.Acrobatics, AbilityNames.Dexterity ],
        [ SkillNames.AnimalHandling, AbilityNames.Widsom ],
        [ SkillNames.Arcana, AbilityNames.Intelligence ],
        [ SkillNames.Athletics, AbilityNames.Strength ],
        [ SkillNames.Deception, AbilityNames.Charisma ],
        [ SkillNames.History, AbilityNames.Intelligence ],
        [ SkillNames.Insight, AbilityNames.Widsom ],
        [ SkillNames.Intimidation, AbilityNames.Charisma ],
        [ SkillNames.Investigation, AbilityNames.Intelligence ],
        [ SkillNames.Medicine, AbilityNames.Widsom ],
        [ SkillNames.Nature, AbilityNames.Intelligence ],
        [ SkillNames.Perception, AbilityNames.Widsom ],
        [ SkillNames.Performance, AbilityNames.Charisma ],
        [ SkillNames.Persuasion, AbilityNames.Charisma ],
        [ SkillNames.Religion, AbilityNames.Intelligence ],
        [ SkillNames.SleightOfHand, AbilityNames.Dexterity ],
        [ SkillNames.Stealth, AbilityNames.Dexterity ],
        [ SkillNames.Survival, AbilityNames.Widsom ]
    ])
}