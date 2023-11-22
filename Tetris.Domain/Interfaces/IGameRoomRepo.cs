using System.Threading.Tasks;
using Microsoft.AspNetCore.JsonPatch;
using Tetris.Domain.Models;

namespace Tetris.Domain.Interfaces;

public interface IGameRoomRepo
{
    Task AddGameRoom(GameRoom gameRoom);
    Task TryUpdateGameRoom(JsonPatchDocument<GameRoom> patch, string gameRoomCode);
    Task RemoveGameRoom(GameRoom gameRoom);
    Task<Page<GameRoom>> GetGameRooms(int start, int count);
    Task<GameRoom> GetGameRoom(string gameRoomCode);
}