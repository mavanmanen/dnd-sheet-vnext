using System;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using DndSheetApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace DndSheetApi;

public class Functions
{
    private readonly DatabaseContext _db;

    public Functions(DatabaseContext db)
    {
        _db = db ?? throw new ArgumentNullException(nameof(db));
    }
    
    [FunctionName("GetSheets")]
    [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(Sheet[]))]
    public async Task<IActionResult> GetSheetsAsync(
        [HttpTrigger(AuthorizationLevel.Function, "get", Route = "user/{userId}/sheets")]
        HttpRequest req, string userId)
    {
        var data = await _db.Sheets
            .Where(s => s.UserId.Equals(userId))
            .ToListAsync();

        return new OkObjectResult(data);
    }

    [FunctionName("AddUpdateSheet")]
    [ProducesResponseType((int)HttpStatusCode.OK, Type = typeof(Sheet))]
    public async Task<IActionResult> UpdateSheetAsync(
        [HttpTrigger(AuthorizationLevel.Function, "POST", Route = "user/{userId}/sheets/{sheetId?}")]
        HttpRequest req, string userId, int? sheetId)
    {
        var json = await req.ReadAsStringAsync();
        var sheet = JsonConvert.DeserializeObject<Sheet>(json);

        if (sheetId is not null)
        {
            _db.Sheets.Update(sheet);
        }
        else
        {
            sheet.UserId = userId;
            sheet.Id = (await _db.Sheets.MaxAsync(s => s.Id)).GetValueOrDefault() + 1;
            await _db.Sheets.AddAsync(sheet);
        }

        await _db.SaveChangesAsync();
        return new OkObjectResult(sheet);
    }

    [FunctionName("DeleteSheet")]
    [ProducesResponseType((int)HttpStatusCode.NoContent)]
    public async Task<IActionResult> DeleteSheetAsync(
        [HttpTrigger(AuthorizationLevel.Function, "delete", Route = "user/{userId}/sheets/{id}")]
        HttpRequest req, string userId, int id)
    {
        var sheet = await _db.Sheets.Where(s => s.UserId.Equals(userId)).SingleOrDefaultAsync(s => s.Id == id);
        if (sheet is null)
        {
            return new NotFoundResult();
        }

        _db.Sheets.Remove(sheet);
        await _db.SaveChangesAsync();
        return new NoContentResult();
    }
}