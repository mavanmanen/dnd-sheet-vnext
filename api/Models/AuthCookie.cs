namespace Mavanmanen.DndSheet.API.Models;

public class AuthCookie
{
    public string UserId { get; set; }
    public string[] UserRoles { get; set; }
    public string[] Claims { get; set; }
    public string IdentityProvider { get; set; }
    public string UserDetails { get; set; }
}