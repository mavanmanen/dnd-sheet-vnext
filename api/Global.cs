using System;
using System.Text;
using System.Threading.Tasks;
using Mavanmanen.DndSheet.API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Mavanmanen.DndSheet.API;

public static class Global
{
    public static async Task<IActionResult> AuthorizedRequest(HttpRequest req, Func<AuthCookie, Task<IActionResult>> handler)
    {
        if (!req.Cookies.TryGetValue("StaticWebAppsAuthCookie", out var authCookieBase64) || authCookieBase64 is null)
        {
            return new ForbidResult();
        }

        var json = Encoding.UTF8.GetString(Convert.FromBase64String(authCookieBase64));
        var authCookie = JsonConvert.DeserializeObject<AuthCookie>(json);

        return await handler(authCookie);
    }

    public static class Methods
    {
        public const string Get = "get";
        public const string Post = "post";
        public const string Put = "put";
        public const string Delete = "delete";
    }
}