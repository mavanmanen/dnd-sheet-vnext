import type { Spell } from '.'

export interface MagicSection {
  level: number;
  slotsMaximum: number;
  currentSlots: number;
  spells: Spell[]
}