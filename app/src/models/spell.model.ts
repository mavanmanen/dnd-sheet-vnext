import type { VSM } from '.'

export interface Spell {
  prepared: boolean;
  ritual: boolean;
  castingTime: string;
  range: string;
  duration: string;
  vsm: VSM;
  name: string;
  description: string;
  effect: string;
}