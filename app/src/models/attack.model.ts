export class Attack {
    public name: string
    public damage: string
    public damageType: string
    public finesse: boolean

    constructor(name: string, damage: string, damageType: string, finesse: boolean) {
        this.name = name
        this.damage = damage
        this.damageType = damageType
        this.finesse = finesse
    }
}