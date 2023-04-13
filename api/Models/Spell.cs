namespace DndSheetApi.Models;

public class Spell
{
    public int Id { get; set; }
    public bool Prepared { get; set; }
    public bool Ritual { get; set; }
    public string CastingTime { get; set; }
    public string Range { get; set; }
    public string Duration { get; set; }
    public string School { get; set; }
    public VSM VSM { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string Effect { get; set; }
}