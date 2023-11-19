using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.JsonPatch;
using Tetris.Domain.Models;

namespace Tetris.Domain.Interfaces;

public interface IGameRoomRepo
{
    Task AddGameRoom(GameRoom gameRoom);
    Task UpdateGameRoom(JsonPatchDocument<GameRoom> patch, string gameRoomCode);
    Task RemoveGameRoom(GameRoom gameRoom);
    Task<List<GameRoom>> GetGameRooms(int start, int count);
}