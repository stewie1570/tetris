using System.Threading.Tasks;
using Microsoft.AspNetCore.JsonPatch;
using MongoDB.Driver;
using Tetris.Domain.Interfaces;
using Tetris.Domain.Models;

namespace Tetris.Storage;

public class MongoGameRoomRepo : IGameRoomRepo
{
    private readonly IMongoCollection<GameRoom> _gameRoomsCollection;
    private const string DbName = "tetris";
    private const string CollectionName = "rooms";

    public MongoGameRoomRepo(IMongoClient database)
    {
        _gameRoomsCollection = database.GetDatabase(DbName).GetCollection<GameRoom>(CollectionName);
    }

    public async Task AddGameRoom(GameRoom gameRoom)
    {
        await _gameRoomsCollection.InsertOneAsync(gameRoom);
    }

    public async Task UpdateGameRoom(JsonPatchDocument<GameRoom> patch, string gameRoomCode)
    {
        var filter = Builders<GameRoom>.Filter.Eq(x => x.OrganizerId, gameRoomCode);

        await _gameRoomsCollection.UpdateOneAsync(filter, patch.ToMongoUpdate());
    }

    public async Task RemoveGameRoom(GameRoom gameRoom)
    {
        var filter = Builders<GameRoom>.Filter.Eq(x => x.OrganizerId, gameRoom.OrganizerId);
        await _gameRoomsCollection.DeleteOneAsync(filter);
    }

    public async Task<Page<GameRoom>> GetGameRooms(int start, int count)
    {
        var totalGameRooms = await _gameRoomsCollection.CountDocumentsAsync(Builders<GameRoom>.Filter.Empty);

        var gameRooms = await _gameRoomsCollection.Find(Builders<GameRoom>.Filter.Empty)
            .Project<GameRoom>(Builders<GameRoom>.Projection.Exclude("_id"))
            .Skip(start)
            .Limit(count)
            .ToListAsync();

        var page = new Page<GameRoom>
        {
            Total = (int)totalGameRooms,
            Start = (start + count) > totalGameRooms
                ? (int)totalGameRooms - gameRooms.Count
                : start,
            Count = gameRooms.Count,
            Items = gameRooms
        };

        return page;
    }
}
