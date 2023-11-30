using System;
using Microsoft.AspNetCore.Hosting;
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
#if !DEBUG
                    var port = Environment.GetEnvironmentVariable("PORT") ?? "80";
                    webBuilder.UseUrls("http://*:" + port);
#endif

                    if (GlobalConfig.IsSentryEnabled())
                    {
                        webBuilder.UseSentry(o =>
                        {
                            o.Dsn = GlobalConfig.SentryDsn();
                            o.Debug = true;
                            o.TracesSampleRate = 1.0;
                            o.AutoSessionTracking = true;
                        });
                    }
                });
    }
}
