using System.Collections.Generic;

namespace DndSheetApi.Models;

public class Magic
{
    public string SpellCastingClass { get; set; }
    public string SpellCastingAbility { get; set; }
    public ICollection<MagicSection> Sections { get; set; }
}