import type { Spell, MagicSection } from '.'

export interface Magic {
  spellCastingClass: string;
  spellCastingAbility: string;
  sections: MagicSection[]
}