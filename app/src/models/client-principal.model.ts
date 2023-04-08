
export class ClientPrincipal {
    public userId: string;
    public userRoles: string[];
    public claims: string[];
    public identityProvider: string;
    public userDetails: string;

    constructor(userId: string, userRoles: string[], claims: string[], identityProvider: string, userDetails: string) {
        this.userId = userId;
        this.userRoles = userRoles;
        this.claims = claims;
        this.identityProvider = identityProvider;
        this.userDetails = userDetails;
    }
}
