export class Currency {
    public copper: number
    public silver: number
    public electrum: number
    public gold: number
    public platinum: number

    constructor(copper: number, silver: number, electrum: number, gold: number, platinum: number) {
        this.copper = copper
        this.silver = silver
        this.electrum = electrum
        this.gold = gold
        this.platinum = platinum
    }
}