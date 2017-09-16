using System;
using System.Net;
using System.Net.Http;
using System.Web.Http.Filters;

namespace Tetris.ErrorHandling
{
    public class HandleErrorFilter : ExceptionFilterAttribute
    {
        public Type ExceptionType { get; set; }
        public HttpStatusCode StatusCode { get; set; }
        public string Message { get; set; }

        public override void OnException(HttpActionExecutedContext context)
        {
            if (context.Exception.GetType().IsAssignableFrom(ExceptionType))
            {
                context.Response = new HttpResponseMessage
                {
                    StatusCode = StatusCode,
                    ReasonPhrase = Message ?? context.Exception.Message
                };
            }
        }
    }
}