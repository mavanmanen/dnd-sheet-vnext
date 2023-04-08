import { Sheet, User } from "@/models"

export class ApiService {

    private async getUserAsync(): Promise<User> {
        const response = await fetch("/.auth/me");
        return await response.json() as User;
    }

    public async GetSheetsAsync(): Promise<Map<string | null, Sheet>> {
        var user = await this.getUserAsync();

        const response = await fetch(`${import.meta.env.VITE_API_CONNECTION}/${user.clientPrincipal.userId}/sheets`, {
            method: 'GET',
            mode: 'cors'
        })

        const json = await response.json()
        // @ts-ignore
        const data = new Map<string, any>(Object.entries(json))
        const retVal = new Map<string, Sheet>()

        for(const [key, value] of data)
        {
            retVal.set(key, Sheet.fromJSON(value))
        }

        return retVal
    }

    public async SaveSheetAsync(id: string | null, sheet: Sheet): Promise<void> {
        var user = await this.getUserAsync();

        const response = await fetch(`${import.meta.env.VITE_API_CONNECTION}/${user.clientPrincipal.userId}/sheets/${id ?? ''}`, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(sheet)
        })
    }
}

const apiService = new ApiService()
export default apiService