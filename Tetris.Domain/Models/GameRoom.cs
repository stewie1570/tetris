using System.Collections.Generic;

namespace Tetris.Domain.Models;

public enum GameRoomStatus
{
    Running,
    Waiting
}

public record GameRoom
{
    public Dictionary<string, UserScore> Players { get; set; }
    public GameRoomStatus Status { get; set; }
    public string OrganizerId { get; set; }
    public string HostConnectionId { get; set; }
}