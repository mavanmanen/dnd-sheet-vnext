import type { Sheet } from '@/models'
import sheetConverter from '@/sheet-converter'

export class ApiClient {
  private getRoute = (userId: string, id?: number) => `/api/user/${userId}/sheets/${id ?? ''}`
  public deleteSheetAsync = (userId: string, id: number) => fetch(this.getRoute(userId, id), { method: 'DELETE' })
  public listSheetsAsync = (userId: string) => fetch(this.getRoute(userId), { method: 'GET' }).then(async r => r.text()).then(json => sheetConverter.fromJSON(json))
  public addUpdateSheetAsync = (userId: string, body: Sheet, id?: number) => fetch(this.getRoute(userId, id), { method: 'POST', body: sheetConverter.toJSON(body) }).then(async r => await r.text()).then(json => sheetConverter.fromJSON(json))
}
