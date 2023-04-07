import { ArmorClasses } from "./armor-classes.model";


export class ArmorStats {
    public armorClass: ArmorClasses;
    public ac: number;

    constructor(armorClass: ArmorClasses, ac: number) {
        this.armorClass = armorClass;
        this.ac = ac;
    }
}
