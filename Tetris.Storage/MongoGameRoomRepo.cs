using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using Tetris.Domain.Interfaces;
using Tetris.Domain.Models;

public class MongoGameRoomRepo : IGameRoomRepo
{
    private readonly IMongoCollection<GameRoom> _gameRoomCollection;
    private const string DbName = "tetris";
    private const string CollectionName = "rooms";

    public MongoGameRoomRepo(IMongoClient mongoClient)
    {
        var database = mongoClient.GetDatabase(DbName);
        _gameRoomCollection = database.GetCollection<GameRoom>(CollectionName);
    }

    public async Task AddOrUpdateGameRoom(GameRoom gameRoom)
    {
        var filter = Builders<GameRoom>.Filter.Eq("_id", gameRoom.OrganizerId);
        var options = new ReplaceOptions { IsUpsert = true };

        await _gameRoomCollection.ReplaceOneAsync(filter, gameRoom, options);
    }

    public async Task RemoveGameRoom(GameRoom gameRoom)
    {
        var filter = Builders<GameRoom>.Filter.Eq("_id", gameRoom.OrganizerId);

        await _gameRoomCollection.DeleteOneAsync(filter);
    }

    public async Task<List<GameRoom>> GetGameRooms(int start, int count)
    {
        var gameRooms = await _gameRoomCollection.Find(new BsonDocument())
            .Skip(start)
            .Limit(count)
            .ToListAsync();

        return gameRooms;
    }
}

