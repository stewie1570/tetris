using System.Collections.Generic;
using System.Threading.Tasks;
using Tetris.Domain.Models;

namespace Tetris.Domain.Interfaces;

public interface IGameRoomRepo
{
    Task AddOrUpdateGameRoom(GameRoom gameRoom);
    Task RemoveGameRoom(GameRoom gameRoom);
    Task<List<GameRoom>> GetGameRooms(int start, int count);
}