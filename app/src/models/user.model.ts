import type { ClientPrincipal } from "."

export class User {
    public clientPrincipal: ClientPrincipal

    constructor(clientPrincipal: ClientPrincipal) {
        this.clientPrincipal = clientPrincipal
    }
}

