using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Tetris.Domain.Interfaces;
using Tetris.Domain.Models;

public class InMemoryGameRoomRepo : IGameRoomRepo
{
    private List<GameRoom> theList = new List<GameRoom>();

    public Task AddOrUpdateGameRoom(GameRoom gameRoom)
    {
        theList.Add(gameRoom);
        return Task.FromResult(0);
    }

    public Task<List<GameRoom>> GetGameRooms(int start, int count)
    {
        return Task.FromResult(theList.Skip(start).Take(count).ToList());
    }

    public Task RemoveGameRoom(GameRoom gameRoom)
    {
        theList = theList.Where(room => room.OrganizerId != gameRoom.OrganizerId).ToList();
        return Task.FromResult(0);
    }
}
