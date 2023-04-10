export { }
declare global {
    export interface Number {
        formatModifier(): string
        getModifier(): number
    }
}

Number.prototype.formatModifier = function(): string {
    return `${(this > 0 ? '+' : '')}${this.toString()}`
}

Number.prototype.getModifier = function(): number {
    return Math.floor((this - 10) / 2)
}