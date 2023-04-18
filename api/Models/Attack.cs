﻿namespace DndSheetApi.Models;

public class Attack
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Damage { get; set; }
    public string DamageType { get; set; }
    public bool Proficiency { get; set; }
    public string Ability { get; set; }
}