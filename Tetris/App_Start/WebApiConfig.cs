using Newtonsoft.Json.Serialization;
using System;
using System.Net;
using System.Net.Http.Formatting;
using System.Web.Http;
using Tetris.Core.Exceptions;
using Tetris.ErrorHandling;

namespace Tetris
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services
            GlobalConfiguration.Configuration.Formatters.Clear();
            GlobalConfiguration.Configuration.Formatters.Add(new JsonMediaTypeFormatter());
            config.Formatters.JsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            config.Formatters.JsonFormatter.UseDataContractJsonSerializer = false;

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );


            config.Filters.Add(new HandleErrorFilter
            {
                ExceptionType = typeof(ValidationException),
                StatusCode = HttpStatusCode.BadRequest
            });

            config.Filters.Add(new HandleErrorFilter
            {
                ExceptionType = typeof(Exception),
                StatusCode = HttpStatusCode.InternalServerError,
                Message = "I'm sorry, an un-expected error has occurred."
            });
        }
    }
}
