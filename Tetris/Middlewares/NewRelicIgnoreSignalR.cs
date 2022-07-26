using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;

namespace Website.Middlewares
{
    public class NewRelicIgnore
    {
        private const string ForwardedProtoHeader = "X-Forwarded-Proto";
        private readonly RequestDelegate next;
        private readonly string hubPath;

        public NewRelicIgnore(RequestDelegate next, string hubPath)
        {
            this.next = next;
            this.hubPath = hubPath;
        }

        public async Task Invoke(HttpContext ctx)
        {
            if (ctx.Request.Path.Value.Equals(hubPath, System.StringComparison.CurrentCultureIgnoreCase)
                || ctx.Request.Path.Value.StartsWith($"{hubPath}/"))
            {
                NewRelic.Api.Agent.NewRelic.IgnoreTransaction();
                NewRelic.Api.Agent.NewRelic.IgnoreApdex();
            }
            await next(ctx);
        }
    }

    public static class NewRelicIgnoreExtensions
    {
        public static IApplicationBuilder UseNewRelicIgnore(this IApplicationBuilder builder, string hubPath)
        {
            return builder.UseMiddleware<NewRelicIgnore>(hubPath);
        }
    }
}