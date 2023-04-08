import type { Sheet, User } from "@/models"

export class ApiService {

    private async GetUser(): Promise<User> {
        const response = await fetch('/.auth/me');
        return await response.json() as User
    }

    public async GetSheetsAsync(): Promise<Map<string, Sheet>> {
        const gql = `
        query {
            sheets(filter: { 
                userId: {
                    eq: ""
                }
             }) {
                items {
                    id,
                    json,
                    $userId
                }
            }
        }`

        const user = await this.GetUser()

        const query = {
            query: gql,
            variables: {
                userId: user.clientPrincipal.userId
            }
        }

        const response = await fetch('/data-api/graphql', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(query)
        })

        const result = await response.json()
        console.table(result.data.sheet_by_userid)

        const retVal = new Map<string, Sheet>()

        return retVal
    }

    public async SaveSheetAsync(id: string | null, sheet: Sheet): Promise<void> {
        const response = await fetch(`${import.meta.env.VITE_API_CONNECTION}/sheets/${id ?? ''}`, {
            method: 'POST',
            credentials: 'include',
            mode: 'cors',
            body: JSON.stringify(sheet)
        })
    }
}

const apiService = new ApiService()
export default apiService