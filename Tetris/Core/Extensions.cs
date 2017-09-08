using System.Collections.Generic;
using System.Linq;

namespace Tetris.Core
{
    public static class Extensions
    {
        public static IEnumerable<T> Concat<T>(this IEnumerable<T> list, T item)
        {
            return (list ?? new List<T>()).Concat(new List<T> { item });
        }
    }
}