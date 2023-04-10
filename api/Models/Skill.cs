namespace DndSheetApi.Models;

public class Skill
{
    public int Id { get; set; }
    public string Name { get; set; }
    public bool Proficiency { get; set; }
    public bool Expertise { get; set; }
}