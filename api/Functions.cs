using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace DndSheetApi;

public class Functions
{
    private readonly DatabaseContext _db;

    public Functions(DatabaseContext db)
    {
        _db = db ?? throw new ArgumentNullException(nameof(db));
        _db.Database.EnsureCreated();
    }
    
    [FunctionName("GetSheets")]
    public async Task<IActionResult> GetSheetsAsync(
        [HttpTrigger(AuthorizationLevel.Function, "get", Route = "{userId}/sheets")]
        HttpRequest req, string userId)
    {
        var data = await _db.Sheets
            .Where(s => s.UserId.Equals(userId))
            .ToDictionaryAsync(
                k => k.Id,
                v => v.Json);

        return new OkObjectResult(data);
    }

    [FunctionName("AddOrUpdateSheet")]
    public async Task<IActionResult> AddOrUpdateSheetAsync(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = "{userId}/sheets/{sheetId?}")] 
        HttpRequest req, string userId, int? sheetId)
    {
        var json = await req.ReadAsStringAsync();
        Sheet sheet;
        if (sheetId is null)
        {
            sheet = new Sheet
            {
                UserId = userId,
                Json = json
            };
            
            await _db.Sheets.AddAsync(sheet);
        }
        else
        {
            sheet = await _db.Sheets.SingleOrDefaultAsync(s => s.Id == sheetId);
            if (sheet is null)
            {
                return new NotFoundResult();
            }

            sheet.Json = json;
        }

        await _db.SaveChangesAsync();
        return new OkObjectResult(sheet);
    }
}