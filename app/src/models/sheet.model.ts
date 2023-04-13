import type {
    CharacterInfo,
    Ability,
    General,
    Skill,
    Armor,
    HealthPoints,
    HitDice,
    DeathSave,
    Currency,
    Equipment,
    PIBF,
    Attack,
    Feature,
    Proficiencies,
    Note,
    Magic
} from '.'

export interface Sheet {
    id?: number;
    userId: string;
    characterInfo: CharacterInfo;
    abilities: Ability[];
    general: General;
    skills: Skill[];
    armor: Armor;
    healthPoints: HealthPoints;
    hitDice: HitDice;
    deathSave: DeathSave;
    currency: Currency;
    equipment: Equipment[];
    pibf: PIBF;
    attacks: Attack[];
    features: Feature[];
    proficiencies: Proficiencies;
    notes: Note[];
    magic: Magic;
}