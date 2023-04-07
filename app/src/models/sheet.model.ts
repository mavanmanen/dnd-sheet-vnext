import { CharacterInfo } from "./character-info.model"
import { AbilityScore } from "./ability-score.model"
import { AbilityNames } from "./ability-names.model"
import { Skill } from "./skill.model"
import { SkillNames } from "./skill-names.model"
import { ArmorTypes } from "./armor-types.model"
import { SkillAbilityTable } from "./skill-ability-table.model"
import { Currency } from "./currency.model"
import { Equipment } from "./equipment-item.model"
import { Attack } from "./attack.model"
import { Feature } from "./feature.model"
import { Proficiencies } from "./proficiencies.model"
import { Note } from "./note.model"

export class Sheet {
    public id: string
    public characterInfo: CharacterInfo
    public abilityScores: Array<AbilityScore> 
    public inspiration: number
    public proficiencyBonus: number
    public skills: Array<Skill>
    public armor: string
    public shield: boolean
    public speed: number
    public maximumHitpoints: number
    public currentHitpoints: number
    public temporaryHitpoints: number
    public hitDiceTotal: string
    public hitDice: string
    public deathSaveSuccesses: Array<boolean>
    public deathSaveFailures: Array<boolean>
    public currency: Currency
    public equipment: Array<Equipment>
    public personalityTraits: string
    public ideals: string
    public bonds: string
    public flaws: string
    public attacks: Array<Attack>
    public features: Array<Feature>
    public proficiencies: Proficiencies
    public notes: Array<Note>

    constructor(
        id: string,
        characterInfo: CharacterInfo,
        abilityScores: Array<AbilityScore>,
        inspiration: number,
        proficiencyBonus: number,
        skills: Array<Skill>,
        armor: string,
        shield: boolean,
        speed: number,
        maximumHitpoints: number,
        currentHitpoints: number,
        temporaryHitpoints: number,
        hitDiceTotal: string,
        hitDice: string,
        deathSaveSuccesses: Array<boolean>,
        deathSaveFailures: Array<boolean>,
        currency: Currency,
        equipment: Array<Equipment>,
        peronalityTraits: string,
        ideals: string,
        bonds: string,
        flaws: string,
        attacks: Array<Attack>,
        features: Array<Feature>,
        proficiencies: Proficiencies,
        notes: Array<Note>) {
        this.id = id
        this.characterInfo = characterInfo
        this.abilityScores = abilityScores
        this.inspiration = inspiration
        this.proficiencyBonus = proficiencyBonus
        this.skills = skills
        this.armor = armor
        this.shield = shield
        this.speed = speed
        this.maximumHitpoints = maximumHitpoints
        this.currentHitpoints = currentHitpoints
        this.temporaryHitpoints = temporaryHitpoints
        this.hitDiceTotal = hitDiceTotal
        this.hitDice = hitDice
        this.deathSaveSuccesses = deathSaveSuccesses
        this.deathSaveFailures = deathSaveFailures
        this.currency = currency
        this.equipment = equipment
        this.personalityTraits = peronalityTraits
        this.ideals = ideals
        this.bonds = bonds
        this.flaws = flaws
        this.attacks = attacks
        this.features = features
        this.proficiencies = proficiencies
        this.notes = notes
    }

    public static new(): Sheet {
        return new Sheet(
            crypto.randomUUID(),
            CharacterInfo.new(),
            new Array<AbilityScore>(
                new AbilityScore(AbilityNames.Strength),
                new AbilityScore(AbilityNames.Dexterity),
                new AbilityScore(AbilityNames.Constitution),
                new AbilityScore(AbilityNames.Intelligence),
                new AbilityScore(AbilityNames.Widsom),
                new AbilityScore(AbilityNames.Charisma)
            ),
            0,
            0,
            new Array<Skill>(
                new Skill(SkillNames.Acrobatics),
                new Skill(SkillNames.AnimalHandling),
                new Skill(SkillNames.Arcana),
                new Skill(SkillNames.Athletics),
                new Skill(SkillNames.Deception),
                new Skill(SkillNames.History),
                new Skill(SkillNames.Insight),
                new Skill(SkillNames.Intimidation),
                new Skill(SkillNames.Investigation),
                new Skill(SkillNames.Medicine),
                new Skill(SkillNames.Nature),
                new Skill(SkillNames.Perception),
                new Skill(SkillNames.Performance),
                new Skill(SkillNames.Persuasion),
                new Skill(SkillNames.Religion),
                new Skill(SkillNames.SleightOfHand),
                new Skill(SkillNames.Stealth),
                new Skill(SkillNames.Survival)
            ),
            ArmorTypes.ArmorTypeNameMap.keys().next().value,
            false,
            0,
            0,
            0,
            0,
            '',
            '',
            new Array<boolean>(false, false, false),
            new Array<boolean>(false, false, false),
            new Currency(0, 0, 0, 0, 0),
            new Array<Equipment>(),
            '',
            '',
            '',
            '',
            new Array<Attack>(),
            new Array<Feature>(),
            new Proficiencies(new Array<string>, new Array<string>, new Array<string>, new Array<string>),
            new Array<Note>()
        )
    }

    public getAbilityScore(name: AbilityNames): AbilityScore {
        return this.abilityScores.find((x: AbilityScore) => x.name === name)!
    }

    public getSkill(name: SkillNames): Skill {
        return this.skills.find((x: Skill) => x.name === name)!
    }

    public getAbilityForSkill(name: SkillNames): AbilityScore {
        return this.abilityScores.find((x: AbilityScore) => x.name === SkillAbilityTable.Mapping.get(name))!
    }

    public static fromJSON(json: string): Sheet {
        const data = JSON.parse(json)
        return new Sheet(
            data.id,
            CharacterInfo.fromJSON(JSON.stringify(data.characterInfo)),
            data.abilityScores.map((x: object) => AbilityScore.fromJSON(JSON.stringify(x))),
            data.inspiration,
            data.proficiencyBonus,
            data.skills,
            data.armor,
            data.shield,
            data.speed,
            data.maximumHitpoints,
            data.currentHitpoints,
            data.temporaryHitpoints,
            data.hitDiceTotal,
            data.hitDice,
            data.deathSaveSuccesses,
            data.deathSaveFailures,
            data.currency,
            data.equipment,
            data.personalityTraits,
            data.ideals,
            data.bonds,
            data.flaws,
            data.attacks,
            data.features,
            Proficiencies.fromJSON(JSON.stringify(data.proficiencies)),
            data.notes
        )
    }

    public get getAc(): number {
        const armor = ArmorTypes.ArmorTypeNameMap.get(this.armor)!
        const dexMod = this.abilityScores.find((x: AbilityScore) => x.name == AbilityNames.Dexterity)!.modifier

        return armor.ac + dexMod + (this.shield ? 2 : 0)
    }

    public addEquipmentItem() {
        this.equipment.push(new Equipment('', 1))
    }

    public removeEquipmentItem(index: number) {
        this.equipment.splice(index, 1)
    }

    public addAttack() {
        this.attacks.push(new Attack('', '', '', false))
    }

    public removeAttack(index: number) {
        this.attacks.splice(index, 1)
    }

    public addFeature() {
        this.features.push(new Feature('', ''))
    }

    public removeFeature(index: number) {
        this.features.splice(index, 1)
    }

    public addNote() {
        if(this.notes === undefined) {
            this.notes = new Array<Note>()
        }

        this.notes.push(new Note('', ''))
    }

    public removeNote(index: number) {
        this.notes.splice(index, 1)
    }
}