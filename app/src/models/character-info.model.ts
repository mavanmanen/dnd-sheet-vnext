export class CharacterInfo {
    public name: string
    public class: string
    public level: string
    public race: string
    public background: string
    public playerName: string
    public alignment: string
    public experiencePoints: string

    constructor(
        name: string,
        className: string,
        level: string,
        race: string,
        background: string,
        playerName: string,
        alignment: string,
        experiencePoints: string) {
        this.name = name
        this.class = className,
        this.level = level,
        this.race = race
        this.background = background
        this.playerName = playerName
        this.alignment = alignment
        this.experiencePoints = experiencePoints
    }

    public static new(): CharacterInfo {
        return new CharacterInfo('', '', '1', '', '', '', '', '0')
    }

    public static fromJSON(json: string): CharacterInfo {
        const data = JSON.parse(json)
        return new CharacterInfo(
            data.name,
            data.class,
            data.level,
            data.race,
            data.background,
            data.playerName,
            data.alignment,
            data.experiencePoints
        )
    }
}