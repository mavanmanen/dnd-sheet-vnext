using System.Collections.Generic;

namespace DndSheetApi.Models;

public class DeathSave
{
    public List<bool> Success { get; set; }
    public List<bool> Failure { get; set; }
}