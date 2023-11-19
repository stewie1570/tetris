using System.Collections.Generic;
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

        await _gameRoomsCollection.UpdateOneAsync(filter, patch.ToMongoUpdate<GameRoom>());
    }

    public async Task RemoveGameRoom(GameRoom gameRoom)
    {
        var filter = Builders<GameRoom>.Filter.Eq(x => x.OrganizerId, gameRoom.OrganizerId);
        await _gameRoomsCollection.DeleteOneAsync(filter);
    }

    public async Task<List<GameRoom>> GetGameRooms(int start, int count)
    {
        var gameRooms = await _gameRoomsCollection.Find(Builders<GameRoom>.Filter.Empty)
            .Skip(start)
            .Limit(count)
            .ToListAsync();

        return gameRooms;
    }
}
