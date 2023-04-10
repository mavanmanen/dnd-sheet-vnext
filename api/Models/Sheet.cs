using System.Collections.Generic;

namespace DndSheetApi.Models;

public class Sheet
{
    public int? Id { get; set; }
    public string UserId { get; set; }
    public CharacterInfo CharacterInfo { get; set; }
    public ICollection<Ability> Abilities { get; set; }
    public General General { get; set; }
    public ICollection<Skill> Skills { get; set; }
    public Armor Armor { get; set; }
    public HealthPoints HealthPoints { get; set; }
    public HitDice HitDice { get; set; }
    public DeathSave DeathSave { get; set; }
    public Currency Currency { get; set; }
    public ICollection<Equipment> Equipment { get; set; }
    public PIBF PIBF { get; set; }
    public ICollection<Attack> Attacks { get; set; }
    public ICollection<Feature> Features { get; set; }
    public Proficiencies Proficiencies { get; set; }
    public ICollection<Note> Notes { get; set; }
}