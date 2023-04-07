import type { AbilityNames } from "./ability-names.model"

export class AbilityScore {
    public name: AbilityNames
    public score: number = 1
    public proficiency: boolean = false

    public get modifier(): number {
        return Math.floor((this.score - 10) / 2)
    }

    constructor(name: AbilityNames) {
        this.name = name
    }

    public static fromJSON(json: string): AbilityScore {
        var data = JSON.parse(json)
        var retVal = new AbilityScore(data.name)
        retVal.score = data.score
        retVal.proficiency = data.proficiency
        return retVal
    }
}