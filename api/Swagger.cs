using System.Net.Http;
using System.Threading.Tasks;
using AzureFunctions.Extensions.Swashbuckle;
using AzureFunctions.Extensions.Swashbuckle.Attribute;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;

namespace DndSheetApi;

public class Swagger
{
    [FunctionName("SwaggerJson"), SwaggerIgnore, Disable("SwaggerDisabled")]
    public static Task<HttpResponseMessage> SwaggerJsonAsync(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "swagger.json")] HttpRequestMessage req, [SwashBuckleClient] ISwashBuckleClient swashBuckleClient) =>
        Task.FromResult(swashBuckleClient.CreateSwaggerJsonDocumentResponse(req));
    
    [FunctionName("SwaggerUI"), SwaggerIgnore, Disable("SwaggerDisabled")]
    public Task<HttpResponseMessage> SwaggerUIAsync(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "swaggerUI")] HttpRequestMessage req, [SwashBuckleClient] ISwashBuckleClient swashBuckleClient) =>
        Task.FromResult(swashBuckleClient.CreateSwaggerUIResponse(req, "swagger.json"));
}