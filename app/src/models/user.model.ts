export interface User {
  clientPrincipal: {
    userId: string
    userRoles: string[]
    claims: string[]
    identityProvider: string
    userDetails: string
  }
}