using System.Collections.Generic;

namespace DndSheetApi.Models;

public class MagicSection
{
    public int Id { get; set; }
    public int Level { get; set; }
    public int SlotsMaximum { get; set; }
    public int CurrentSlots { get; set; }
    public ICollection<Spell> Spells { get; set; }
}