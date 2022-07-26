using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;

namespace Website.Middlewares
{
    public class NewRelicIgnore
    {
        private readonly RequestDelegate next;
        private readonly string path;

        public NewRelicIgnore(RequestDelegate next, string path)
        {
            this.next = next;
            this.path = path;
        }

        public async Task Invoke(HttpContext ctx)
        {
            if (ctx.Request.Path.Value.Equals(path, System.StringComparison.CurrentCultureIgnoreCase)
                || ctx.Request.Path.Value.StartsWith($"{path}/"))
            {
                NewRelic.Api.Agent.NewRelic.IgnoreTransaction();
                NewRelic.Api.Agent.NewRelic.IgnoreApdex();
            }
            await next(ctx);
        }
    }

    public static class NewRelicIgnoreExtensions
    {
        public static IApplicationBuilder UseNewRelicIgnore(this IApplicationBuilder builder, string path)
        {
            return builder.UseMiddleware<NewRelicIgnore>(path);
        }
    }
}