using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
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
            var forwardedIP = ctx.Request.Headers["X-Forwarded-For"].ToString();
            logger.LogInformation("{method} {url} from {ip}{forwardInfo}",
                ctx.Request.Method,
                UriHelper.GetEncodedUrl(ctx.Request),
                ctx.Connection.RemoteIpAddress,
                string.IsNullOrWhiteSpace(forwardedIP) ? "" : $" (forwarded from: {forwardedIP})"
            );
            await next(ctx);
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