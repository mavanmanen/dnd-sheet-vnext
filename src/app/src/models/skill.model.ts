import type { SkillNames } from "./skill-names.model";

export class Skill {
    public name: SkillNames
    public proficiency: boolean = false
    public expertise: boolean = false

    constructor(name: SkillNames) {
        this.name = name
    }
}