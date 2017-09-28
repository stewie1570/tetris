using System;

namespace Tetris
{
    public static class ApplicationInstanceIdProvider
    {
        private static string currentInstanceHash;

        public static string Current
        {
            get
            {
                if (currentInstanceHash == null)
                    currentInstanceHash = Guid.NewGuid().ToString().Replace("-", string.Empty);
                return currentInstanceHash;
            }
        }
    }
}