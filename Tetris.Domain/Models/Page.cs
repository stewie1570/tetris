using System.Collections.Generic;

namespace Tetris.Domain.Models;

public class Page<T>
{
    public int Total { get; set; }
    public int Start { get; set; }
    public int Count { get; set; }
    public List<T> Items { get; set; }
}
