export class Note {
    public id: string
    public title: string
    public content: string

    constructor(title: string, content: string) {
        this.id = crypto.randomUUID()
        this.title = title
        this.content = content
    }
}