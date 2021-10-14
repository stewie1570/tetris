using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.Hosting;

namespace Tetris
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                    webBuilder.UseKestrel(options =>
                    {
                        var urlString = webBuilder.GetSetting("ASPNETCORE_URLS");
                        var port = string.IsNullOrWhiteSpace(urlString)
                            ? 5001
                            : int.Parse(urlString.Split(":")[1]);
                        options.ListenAnyIP(port, listenOptions =>
                        {
                            listenOptions.Protocols = HttpProtocols.Http1AndHttp2AndHttp3;
                            listenOptions.UseHttps();
                        });
                    });
                });
    }
}
