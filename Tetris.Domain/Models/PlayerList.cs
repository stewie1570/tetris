using System.Collections.Generic;

namespace Tetris.Domain.Models;

public record Player
{
    public string UserId { get; set; }
    public string Name { get; set; }
}

public record PlayersList
{
    public List<Player> Players { get; set; }
}