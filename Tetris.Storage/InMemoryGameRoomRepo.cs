using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.JsonPatch;
using Tetris.Domain.Interfaces;
using Tetris.Domain.Models;

public class InMemoryGameRoomRepo : IGameRoomRepo
{
    private List<GameRoom> theList = new List<GameRoom>();

    public Task AddGameRoom(GameRoom gameRoom)
    {
        if (!theList.Any(room => room.OrganizerId == gameRoom.OrganizerId))
        {
            theList.Add(gameRoom);
        }
        return Task.FromResult(0);
    }

    public Task UpdateGameRoom(JsonPatchDocument<GameRoom> patch, string gameRoomCode)
    {
        var theGameRoom = theList.FirstOrDefault(room => room.OrganizerId == gameRoomCode);
        if (theGameRoom != null)
        {
            patch.ApplyTo(theGameRoom);
        }

        return Task.FromResult(0);
    }

    public Task<Page<GameRoom>> GetGameRooms(int start, int count)
    {
        var gameRooms = theList.Skip(start).Take(count).ToList();

        return Task.FromResult(new Page<GameRoom>
        {
            Items = gameRooms,
            Total = theList.Count,
            Start = (start + count) > theList.Count
                ? theList.Count - gameRooms.Count
                : start,
            Count = gameRooms.Count
        });
    }

    public Task RemoveGameRoom(GameRoom gameRoom)
    {
        theList = theList.Where(room => room.OrganizerId != gameRoom.OrganizerId).ToList();
        return Task.FromResult(0);
    }
}
