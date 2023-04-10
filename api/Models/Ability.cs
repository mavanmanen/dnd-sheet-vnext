namespace DndSheetApi.Models;

public class Ability
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Shortname { get; set; }
    public int Score { get; set; }
    public bool Proficiency { get; set; }
}