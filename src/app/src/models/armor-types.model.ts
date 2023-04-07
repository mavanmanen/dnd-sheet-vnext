import { ArmorClasses } from "./armor-classes.model"
import { ArmorStats } from "./armor-stats.model"

export class ArmorTypes {
    public static Padded = new ArmorStats(ArmorClasses.Light, 11)
    public static Leather = new ArmorStats(ArmorClasses.Light, 11)
    public static StuddedLeather = new ArmorStats(ArmorClasses.Light, 12)
    public static Hide = new ArmorStats(ArmorClasses.Medium, 12)
    public static ChainShirt = new ArmorStats(ArmorClasses.Medium, 13)
    public static ScaleMail = new ArmorStats(ArmorClasses.Medium, 14)
    public static Breastplate = new ArmorStats(ArmorClasses.Medium, 14)
    public static HalfPlate = new ArmorStats(ArmorClasses.Medium, 15)
    public static RingMail = new ArmorStats(ArmorClasses.Heavy, 14)
    public static ChainMail = new ArmorStats(ArmorClasses.Heavy, 16)
    public static Splint = new ArmorStats(ArmorClasses.Heavy, 17)
    public static Plate = new ArmorStats(ArmorClasses.Heavy, 18)

    public static ArmorTypeNameMap: Map<string, ArmorStats> = new Map<string, ArmorStats>([
        [ 'Padded', this.Padded ],
        [ 'Leather', this.Leather ],
        [ 'Studded Leather', this.StuddedLeather ],
        [ 'Hide', this.Hide ],
        [ 'Chain Shirt', this.ChainShirt ],
        [ 'Scale Mail', this.ScaleMail ],
        [ 'Breastplate', this.Breastplate ],
        [ 'Half Plate', this.HalfPlate ],
        [ 'Ring Mail', this.RingMail ],
        [ 'Chain Mail', this.ChainMail ],
        [ 'Splint', this.Splint ],
        [ 'Plate', this.Plate ]
    ])
}