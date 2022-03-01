using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;

namespace Website.Middlewares
{
    public class ReverseProxyHttpsRedirect
    {
        private const string ForwardedProtoHeader = "X-Forwarded-Proto";
        private readonly RequestDelegate next;

        public ReverseProxyHttpsRedirect(RequestDelegate next)
        {
            this.next = next;
        }

        public async Task Invoke(HttpContext ctx)
        {
            var forwardedProto = ctx.Request.Headers[ForwardedProtoHeader].ToString();
            if (forwardedProto == string.Empty || forwardedProto == "https")
            {
                await next(ctx);
            }
            else if (forwardedProto != "https")
            {
                var withHttps = $"https://{ctx.Request.Host}{ctx.Request.Path}{ctx.Request.QueryString}";
                ctx.Response.Redirect(withHttps);
            }
        }
    }

    public static class ReverseProxyHttpsRedirectExtensions
    {
        public static IApplicationBuilder UseReverseProxyHttpsRedirect(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<ReverseProxyHttpsRedirect>();
        }
    }
}