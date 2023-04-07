export { }
declare global {
    export interface Number {
        formatModifier(): string
    }
}

Number.prototype.formatModifier = function(): string {
    return `${(this > 0 ? '+' : '')}${this.toString()}`
}