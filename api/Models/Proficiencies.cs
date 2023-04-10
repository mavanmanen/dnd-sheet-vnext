using System.Collections.Generic;

namespace DndSheetApi.Models;

public class Proficiencies
{
    public List<string> Languages { get; set; }
    public List<string> Armor { get; set; }
    public List<string> Weapons { get; set; }
    public List<string> Tools { get; set; }
}