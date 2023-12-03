using System.Collections.Generic;
using System.Linq;
using System.Text.Json;

namespace Tetris.Core
{
    public static class Extensions
    {
        public static IEnumerable<T> Concat<T>(this IEnumerable<T> list, T item)
        {
            return (list ?? new List<T>()).Concat(new List<T> { item });
        }

        public static T To<T>(this JsonElement jsonElement)
        {
            return JsonSerializer.Deserialize<T>(jsonElement.GetRawText(), new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
        }

        public static JsonElement ToJsonElement(this object obj)
        {
            string jsonString = JsonSerializer.Serialize(obj);

            using (JsonDocument doc = JsonDocument.Parse(jsonString))
            {
                return doc.RootElement.Clone();
            }
        }
    }
}
