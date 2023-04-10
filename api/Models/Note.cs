using System;

namespace DndSheetApi.Models;

public class Note
{
    public int Id { get; set; }
    public string Title { get; set; }
    public DateTime Date { get; set; }
    public string Content { get; set; }
}