using System;
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
        gameRoom.Timestamp = DateTime.UtcNow;

        var filter = Builders<GameRoom>.Filter.Eq(x => x.OrganizerId, gameRoom.OrganizerId);
        var options = new ReplaceOptions { IsUpsert = true };

        await _gameRoomsCollection.ReplaceOneAsync(filter, gameRoom, options);
    }


    public async Task TryUpdateGameRoom(JsonPatchDocument<GameRoom> patch, string gameRoomCode)
    {
        try
        {
            patch.Replace(room => room.Timestamp, DateTime.UtcNow);
            var filter = Builders<GameRoom>.Filter.Eq(x => x.OrganizerId, gameRoomCode);

            await _gameRoomsCollection.UpdateOneAsync(filter, patch.ToMongoUpdate());
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
        }
    }

    public async Task RemoveGameRoom(GameRoom gameRoom)
    {
        var filter = Builders<GameRoom>.Filter.Eq(x => x.OrganizerId, gameRoom.OrganizerId);
        await _gameRoomsCollection.DeleteOneAsync(filter);
    }

    public async Task<Page<GameRoom>> GetGameRooms(int start, int count)
    {
        var totalGameRooms = await _gameRoomsCollection.CountDocumentsAsync(Builders<GameRoom>.Filter.Empty);

        if ((start + count) > totalGameRooms)
        {
            long totalPages = (long)Math.Ceiling(totalGameRooms / (double)count) - 1;
            start = Math.Max((int)(totalPages * count), 0);
        }

        var gettingGameRooms = _gameRoomsCollection.Find(Builders<GameRoom>.Filter.Empty)
            .Project<GameRoom>(Builders<GameRoom>.Projection.Exclude("_id"))
            .Skip(start)
            .Limit(count)
            .ToListAsync();

        var gameRooms = await gettingGameRooms;

        var page = new Page<GameRoom>
        {
            Total = (int)totalGameRooms,
            Start = start,
            Count = gameRooms.Count,
            Items = gameRooms
        };

        return page;
    }
}
