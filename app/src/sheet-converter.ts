import type { Sheet } from '@/models'

export default class SheetConverter {
  static fromJSON(json: string) {
    return JSON.parse(json, (key, value) => {
      if (key == 'parameters') {
        let map = new Map<string, number>()
        for (const key of Object.keys(value)) {
          map.set(key, value[key])
        }
        return map
      }

      return value
    })
  }
  static toJSON(sheet: Sheet, space?: string | number | undefined): string {
    return JSON.stringify(sheet, (_, value) => {
      if (value instanceof Map) {
        let obj = {}
        for (let [k, v] of value) {
          // @ts-ignore
          obj[k] = v
        }
        return obj
      }

      return value
    }, space)
  }
}