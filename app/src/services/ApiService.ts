import { Sheet } from "@/models"

export class ApiService {

    public async GetSheetsAsync(): Promise<Map<string, Sheet>> {
        console.log(import.meta.env)
        const response = await fetch(`${import.meta.env.VITE_API_CONNECTION}/sheets`, {
            method: 'GET',
            credentials: 'include',
            mode: 'cors'
        })

        const json = await response.json()
        // @ts-ignore
        const data = new Map<string, any>(Object.entries(json))
        const retVal = new Map<string, Sheet>()

        for(let key of Object.keys(data))
        {
            retVal.set(key, Sheet.fromJSON(data.get(key)))
        }

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