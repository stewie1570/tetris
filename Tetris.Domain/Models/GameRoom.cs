using System.Collections.Generic;

namespace Tetris.Domain.Models;

public enum GameRoomStatus
{
    Running,
    Waiting
}

public record GameRoom
{
    public Dictionary<string, UserScore> UserScores { get; set; }
    public GameRoomStatus Status { get; set; }
    public string OrganizerId { get; set; }
}