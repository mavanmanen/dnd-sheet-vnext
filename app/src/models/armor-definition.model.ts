import type { ArmorClass } from ".";

export interface ArmorDefinition {
  ac: number;
  class: ArmorClass;
  stealthDisadvantage: boolean;
}