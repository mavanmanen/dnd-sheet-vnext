export class Proficiencies {
    public languages: Array<string>
    public armor: Array<string>
    public weapons: Array<string>
    public tools: Array<string>

    constructor(languages: Array<string>, armor: Array<string>, weapons: Array<string>, tools: Array<string>) {
        this.languages = languages
        this.armor = armor
        this.weapons = weapons
        this.tools = tools
    }

    addLanguageProficieny() {
        this.languages.push('')
    }

    removeLanguageProficiency(index: number) {
        this.languages.splice(index, 1)
    }

    addArmorProficiency() {
        this.armor.push('')
    }

    removeArmorProficiency(index: number) {
        this.armor.splice(index, 1)
    }

    addWeaponProficiency() {
        this.weapons.push('')
    }

    removeWeaponProficiency(index: number) {
        this.weapons.splice(index, 1)
    }

    addToolProficiency() {
        this.tools.push('')
    }

    removeToolProficiency(index: number) {
        this.tools.splice(index, 1)
    }

    public static fromJSON(json: string): Proficiencies {
        var data = JSON.parse(json)
        var retVal = new Proficiencies(data.languages, data.armor, data.weapons, data.tools)
        return retVal
    }
}