using System;

namespace Tetris
{
    public static class GlobalConfig
    {
        public static string SentryDsn()
        {
            return Environment.GetEnvironmentVariable("SentryDsn");
        }

        public static bool IsSentryEnabled()
        {
            return !string.IsNullOrWhiteSpace(SentryDsn());
        }
    }
}
