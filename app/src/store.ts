import { reactive } from 'vue'
import { ApiClient } from './api-client'
import { SkillNames, ArmorTypeAc, type Sheet, type User, type Skill, AbilityNames, type Ability, ProficiencyType, type Attack, type Equipment, type Feature, type Note, type MagicSection, type Spell, type VSM, SpellcastingAbilityNames } from './models'
import popup from '@/popup'
import sheetConverter from '@/sheet-converter'

const apiClient = new ApiClient()

function createSheet(userId: string): Sheet {
  return {
    id: undefined,
    characterInfo: {
      name: '',
      playerName: '',
      race: '',
      level: 0,
      class: '',
      alignment: '',
      background: '',
      experiencePoints: 0
    },
    abilities: (Object.keys(AbilityNames) as Array<keyof typeof AbilityNames>).map(k => {
      return {
        name: k,
        proficiency: false,
        score: 0
      } as Ability
    }),
    armor: {
      shield: false,
      type: ArmorTypeAc.keys().next().value as string
    },
    attacks: [],
    currency: {
      copper: 0,
      electrum: 0,
      gold: 0,
      platinum: 0,
      silver: 0
    },
    deathSave: {
      failure: [false, false, false],
      success: [false, false, false]
    },
    equipment: [],
    features: [],
    general: {
      inspiration: 0,
      proficiencyBonus: 0,
      speed: 0
    },
    healthPoints: {
      current: 0,
      maximum: 0,
      temporary: 0
    },
    hitDice: {
      current: '',
      max: ''
    },
    notes: [],
    pibf: {
      bonds: '',
      flaws: '',
      ideals: '',
      personalityTraits: ''
    },
    proficiencies: {
      armor: [],
      languages: [],
      tools: [],
      weapons: []
    },
    skills: (Object.keys(SkillNames) as Array<keyof typeof SkillNames>).map(k => {
      return {
        name: SkillNames[k],
        expertise: false,
        proficiency: false
      } as Skill
    }),
    userId: userId,
    magic: {
      spellCastingAbility: SpellcastingAbilityNames.Intelligence,
      spellCastingClass: '',
      sections: [...generateSections()]
    },
    parameters: createParameters()
  }
}

function createParameters() {
  let parameters = new Map<string, number>([
    ['AC', 0],
    ['Initiative', 0],
    ['Spell Save DC', 0],
    ['Spell Attack Bonus', 0]
  ])

  for (const ability of (Object.keys(AbilityNames) as Array<keyof typeof AbilityNames>)) {
    parameters.set(AbilityNames[ability], 0)
  }

  for (const skill of (Object.keys(SkillNames) as Array<keyof typeof SkillNames>)) {
    parameters.set(SkillNames[skill], 0)
  }

  return parameters
}

function emptySpell() {
  return {
    castingTime: '',
    description: '',
    duration: '',
    name: '',
    prepared: false,
    range: '',
    ritual: false,
    vsm: {
      v: false,
      s: false,
      m: false
    } as VSM
  } as Spell
}

function* generateSections() {
  for (let level = 0; level <= 9; level++) {
    yield {
      level: level,
      currentSlots: 0,
      slotsMaximum: 0,
      spells: []
    } as MagicSection
  }
}

const store = reactive({
  init: false,
  user: {} as User,
  sheets: new Array<Sheet>(),
  selectedSheetId: 0,
  get selectedSheet(): Sheet {
    return this.findSheet(this.selectedSheetId)!
  },
  set selectedSheet(sheet: Sheet) {
    const index = this.sheets.indexOf(this.findSheet(this.selectedSheetId)!)
    this.sheets[index] = sheet
  },
  selectedNoteId: 0,
  get selectedNote(): Note | undefined {
    return this.selectedSheet.notes?.find(n => n.id == this.selectedNoteId)
  },

  async loadUserAsync() {
    const response = await fetch('/.auth/me')
    this.user = await response.json() as User
  },

  async loadSheetsAsync() {
    this.sheets = await apiClient.listSheetsAsync(this.user.clientPrincipal.userId)
  },

  findSheet(id: number) {
    return this.sheets.find(sheet => sheet.id == id)
  },

  async newSheetAsync() {
    let sheet = createSheet(this.user.clientPrincipal.userId)
    sheet = await apiClient.addUpdateSheetAsync(this.user.clientPrincipal.userId, sheet, undefined)
    this.sheets.push(sheet)
    this.selectedSheetId = sheet.id!
  },

  async deleteSheetAsync() {
    if (window.confirm(`Are you sure you want to delete this sheet?\nSheet Name: ${this.selectedSheet.characterInfo.name}`)) {
      await apiClient.deleteSheetAsync(this.user.clientPrincipal.userId, this.selectedSheetId!)
      this.sheets.splice(this.sheets.indexOf(this.selectedSheet), 1)
    }
  },

  addProficiency(type: ProficiencyType) {
    switch (type) {
      case ProficiencyType.Languages:
        this.selectedSheet.proficiencies.languages.push('')
        break

      case ProficiencyType.Armor:
        this.selectedSheet.proficiencies.armor.push('')
        break

      case ProficiencyType.Weapons:
        this.selectedSheet.proficiencies.weapons.push('')
        break

      case ProficiencyType.Tools:
        this.selectedSheet.proficiencies.tools.push('')
        break
    }
  },

  removeProficieny(type: ProficiencyType, index: number) {
    switch (type) {
      case ProficiencyType.Languages:
        this.selectedSheet.proficiencies.languages.splice(index, 1)
        break

      case ProficiencyType.Armor:
        this.selectedSheet.proficiencies.armor.splice(index, 1)
        break

      case ProficiencyType.Weapons:
        this.selectedSheet.proficiencies.weapons.splice(index, 1)
        break

      case ProficiencyType.Tools:
        this.selectedSheet.proficiencies.tools.splice(index, 1)
        break
    }
  },

  getProficiencies(proficiency: ProficiencyType) {
    switch (proficiency) {
      case ProficiencyType.Armor: return this.selectedSheet.proficiencies.armor
      case ProficiencyType.Languages: return this.selectedSheet.proficiencies.languages
      case ProficiencyType.Tools: return this.selectedSheet.proficiencies.tools
      case ProficiencyType.Weapons: return this.selectedSheet.proficiencies.weapons
    }
  },

  setProficiency(proficiency: ProficiencyType, index: number, value: string) {
    switch (proficiency) {
      case ProficiencyType.Armor:
        this.selectedSheet.proficiencies.armor[index] = value
        break

      case ProficiencyType.Languages:
        this.selectedSheet.proficiencies.languages[index] = value
        break

      case ProficiencyType.Tools:
        this.selectedSheet.proficiencies.tools[index] = value
        break

      case ProficiencyType.Weapons:
        this.selectedSheet.proficiencies.weapons[index] = value
        break
    }
  },

  addAttack() {
    if (!this.selectedSheet.attacks) {
      this.selectedSheet.attacks = []
    }

    this.selectedSheet.attacks.push({
      damage: '',
      damageType: '',
      finesse: false,
      name: '',
      proficiency: false
    } as Attack)
  },

  removeAttack(index: number) {
    this.selectedSheet.attacks.splice(index, 1)
  },

  addEquipment() {
    if (!this.selectedSheet.equipment) {
      this.selectedSheet.equipment = []
    }

    this.selectedSheet.equipment.push({
      name: '',
      amount: 1
    } as Equipment)
  },

  removeEquipment(index: number) {
    this.selectedSheet.equipment.splice(index, 1)
  },

  addFeature() {
    if (!this.selectedSheet.features) {
      this.selectedSheet.features = []
    }
    this.selectedSheet.features.push({
      name: '',
      description: ''
    } as Feature)
  },

  removeFeature(index: number) {
    this.selectedSheet.features.splice(index, 1)
  },

  async saveSheetAsync() {
    await apiClient.addUpdateSheetAsync(this.user.clientPrincipal.userId, this.selectedSheet, this.selectedSheetId)
    popup.showPopup('Sheet saved!')
  },

  exportSheetJSON() {
    const blob = new Blob([sheetConverter.toJSON(this.selectedSheet, 2)])
    const blobUrl = URL.createObjectURL(blob)
    var link = document.createElement('a')
    link.href = blobUrl
    link.download = `${this.selectedSheet.characterInfo.name}.json`
    link.click()
  },

  addNote() {
    if (!this.selectedSheet.notes) {
      this.selectedSheet.notes = []
    }
    const id = this.selectedSheet.notes.length == 0 ? 0 : this.selectedSheet.notes[this.selectedSheet.notes.length - 1].id + 1
    this.selectedSheet.notes.push({
      id: id,
      title: 'New Note',
      content: '',
      date: new Date().toLocaleString()
    } as Note)
  },

  removeNote() {
    if (window.confirm(`Are you sure you want to delete this note?\nNote title: ${this.selectedNote?.title}`)) {
      this.selectedSheet.notes.splice(this.selectedSheet.notes.indexOf(this.selectedNote!), 1)
    }
  },

  getAbility(name: string) {
    return this.selectedSheet.abilities.find(a => a.name == name)!
  },

  addSpell(level: number) {
    let section = this.selectedSheet.magic.sections.find(s => s.level == level)!
    if (section.spells == null) {
      section.spells = []
    }
    section.spells.push(emptySpell())
  },

  removeSpell(level: number, index: number) {
    let section = this.selectedSheet.magic.sections.find(s => s.level == level)!
    section.spells.splice(index, 1)
  },

  async initAsync() {
    if (!this.init) {
      await this.loadUserAsync()
      await this.loadSheetsAsync()

      for (const sheet of this.sheets) {
        if (!sheet.notes) {
          sheet.notes = []
        }

        if (!sheet.magic.sections || sheet.magic.sections.length == 0) {
          sheet.magic.sections = [...generateSections()]
        }

        if (!sheet.parameters || !sheet.parameters.size || sheet.parameters.size == 0) {
          sheet.parameters = createParameters()
        }
      }

      if (this.sheets.length > 0) {
        this.selectedSheetId = this.sheets[0].id!
      } else {
        this.newSheetAsync()
      }

      if (this.selectedSheet.notes.length > 0) {
        this.selectedNoteId = this.selectedSheet.notes[0].id
      } else {
        this.addNote()
      }

      this.init = true
    }
  }
})

export default store