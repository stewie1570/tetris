using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Website.Middlewares
{
    public class IPLogger
    {
        private readonly RequestDelegate next;
        private readonly ILogger logger;

        public IPLogger(RequestDelegate next, ILoggerFactory loggerFactory)
        {
            this.next = next;
            logger = loggerFactory.CreateLogger("IPLogger");
        }

        public async Task Invoke(HttpContext ctx)
        {
            await next(ctx);
            logger.LogInformation("{method} {url} from {ip}",
                ctx.Request.Method,
                ctx.Request.Path.ToString(),
                ctx.Connection.RemoteIpAddress
            );
        }
    }

    public static class IPLoggerExtensions
    {
        public static IApplicationBuilder UseIPLogger(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<IPLogger>();
        }
    }
}