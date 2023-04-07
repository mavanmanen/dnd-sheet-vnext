using System;
using System.ComponentModel.DataAnnotations;

namespace Mavanmanen.DndSheet.API.Data.Models;

public class Sheet
{
    [Key]
    public Guid Id { get; set; }

    public string Json { get; set; }
    public string UserId { get; set; }
}