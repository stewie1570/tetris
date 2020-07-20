using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Tetris.Core.Exceptions;

namespace Tetris
{
    public static class CustomExceptionHandler
    {
        private class ProblemDetailsWithErrors : ProblemDetails
        {
            public string[] Errors { get; set; }
        }

        public static IApplicationBuilder UseCustomExceptionHandler(this IApplicationBuilder app, IWebHostEnvironment env, ILoggerFactory loggerFactory)
        {

            app.UseExceptionHandler(appError =>
            {
                appError.Run(async context =>
                {
                    var contextFeature = context.Features.Get<IExceptionHandlerFeature>();
                    await Respond(env, loggerFactory, context, contextFeature);
                });
            });

            return app;
        }

        private static async Task Respond(IWebHostEnvironment env, ILoggerFactory loggerFactory, HttpContext context, IExceptionHandlerFeature contextFeature)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            if (contextFeature != null)
            {
                var logger = loggerFactory.CreateLogger<Startup>();
                bool isDomainException = contextFeature.Error is DomainException;

                if (isDomainException)
                {
                    logger.LogWarning(contextFeature.Error?.Message);
                }
                else
                {
                    logger.LogError(contextFeature.Error?.Message);
                }

                var statusCode = contextFeature.Error switch
                {
                    ValidationException _ => HttpStatusCode.BadRequest,
                    _ => HttpStatusCode.InternalServerError
                };

                var problemDetails = new ProblemDetailsWithErrors
                {
                    Status = (int)statusCode,
                    Title = isDomainException ? contextFeature.Error.Message
                        : "An error occurred.",
                    Detail = env.IsDevelopment()
                        ? contextFeature.Error.StackTrace
                        : string.Empty
                };

                context.Response.StatusCode = (int)statusCode;
                await context.Response.WriteAsync(JsonConvert.SerializeObject(problemDetails, new JsonSerializerSettings
                {
                    ContractResolver = new DefaultContractResolver
                    {
                        NamingStrategy = new CamelCaseNamingStrategy()
                    }
                }));
            }
        }
    }
}