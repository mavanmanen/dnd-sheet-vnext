using System;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using Mavanmanen.DndSheet.API.Data;
using Mavanmanen.DndSheet.API.Data.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using static Mavanmanen.DndSheet.API.Global;

namespace Mavanmanen.DndSheet.API.Functions;

public class SheetFunctions
{
    private readonly DatabaseContext _databaseContext;

    public SheetFunctions(DatabaseContext databaseContext)
    {
        _databaseContext = databaseContext ?? throw new ArgumentNullException(nameof(databaseContext));
    }
    
    [FunctionName("GetSheets")]
    public async Task<IActionResult> GetSheetsAsync(
        [HttpTrigger(AuthorizationLevel.Function, Methods.Get, Route = "sheets")]
        HttpRequest req, ILogger log) =>
        await AuthorizedRequest(req, async cookie =>
        {
            var sheets = await _databaseContext.Sheets
                .Where(s => s.UserId.Equals(cookie.UserId))
                .ToDictionaryAsync(
                    k => k.Id,
                    v => v.Json);
            
            return new OkObjectResult(sheets);
        });

    [FunctionName("AddUpdateSheet")]
    public async Task<IActionResult> AddSheetAsync(
        [HttpTrigger(AuthorizationLevel.Function, Methods.Post, Route = "sheets/{id?}")]
        HttpRequest req, ILogger log, string? id) =>
        await AuthorizedRequest(req, async cookie =>
        {
            var json = await req.ReadAsStringAsync();
            if (json is null)
            {
                return new BadRequestErrorMessageResult("Body must have sheet json");
            }

            Sheet? sheet;
            if (id is null)
            {
                sheet = new Sheet
                {
                    UserId = cookie.UserId,
                    Json = json
                };

                await _databaseContext.Sheets.AddAsync(sheet);
            }
            else
            {
                sheet = await _databaseContext.Sheets.SingleOrDefaultAsync(s => s.Id.Equals(id));
                if (sheet is null)
                {
                    return new BadRequestErrorMessageResult($"Sheet with id {id} not found");
                }

                sheet.Json = json;
            }
            
            await _databaseContext.SaveChangesAsync();

            return new OkObjectResult(sheet);
        });
}