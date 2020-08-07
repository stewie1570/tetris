using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using StackExchange.Redis;
using Tetris.Domain.Models;
using Xunit;

namespace Tetris.Storage.Tests
{
    public class RedisScoreBoardTests
    {
        [Fact]
        public async Task StoresTheScore()
        {
            var getRedis = ConnectionMultiplexer.ConnectAsync("redis-13180.c62.us-east-1-4.ec2.cloud.redislabs.com:13180,password=M3bvoCfkpINPJRDZJP57KUBOAc4JAjnB");
            IDatabase db = (await getRedis).GetDatabase();

            await Task.WhenAll((await getRedis)
                .GetEndPoints(configuredOnly: false)
                .Select(async endpoint =>
                {
                    var server = (await getRedis).GetServer(endpoint);
                    await foreach (var key in server.KeysAsync())
                    {
                        await db.KeyDeleteAsync(key);
                    }
                }));

            var leaderBoardProvider = new RedisLeaderBoardProvider(getRedis);
            var scoreBoard = new RedisScoreBoardStorage(getRedis);
            (await leaderBoardProvider.GetLeaderBoard())
                .UserScores
                .Should()
                .BeEmpty();

            await scoreBoard.Add(new UserScore { Username = "user 21", Score = 10 });
            await scoreBoard.Add(new UserScore { Username = "user 4", Score = 3 });
            await scoreBoard.Add(new UserScore { Username = "user 1", Score = 1 });
            await scoreBoard.Add(new UserScore { Username = "user 10", Score = 5 });
            await scoreBoard.Add(new UserScore { Username = "user 2", Score = 2 });

            (await leaderBoardProvider.GetLeaderBoard())
                .UserScores
                .Should()
                .BeEquivalentTo(new List<UserScore>{
                    new UserScore{ Username = "user 21", Score = 10},
                    new UserScore{ Username = "user 10", Score = 5},
                    new UserScore{ Username = "user 4", Score = 3},
                    new UserScore{ Username = "user 2", Score = 2},
                    new UserScore{ Username = "user 1", Score = 1}
                });
        }
    }
}