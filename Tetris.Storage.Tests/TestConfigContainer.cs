using System.IO;
using Microsoft.Extensions.Configuration;

namespace Tetris.Storage.Tests
{
    public static class TestConfigContainer
    {
        public static IConfiguration GetConfig()
        {
            return new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddEnvironmentVariables()
                .Build();
        }
    }
}