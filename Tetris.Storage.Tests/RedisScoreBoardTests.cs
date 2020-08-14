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
        private Task<ConnectionMultiplexer> getRedis;

        public RedisScoreBoardTests()
        {
            getRedis = ConnectionMultiplexer.ConnectAsync(TestConfigContainer.GetConfig()["RedisConnectionString"]);
        }

        [Fact]
        public async Task StoresTheScore()
        {
            IDatabase db = (await getRedis).GetDatabase();

            var userScores = new List<UserScore>{
                new UserScore { Username = "user 21", Score = 10 },
                new UserScore { Username = "user 4", Score = 3 },
                new UserScore { Username = "user 1", Score = 1 },
                new UserScore { Username = "user 10", Score = 5 },
                new UserScore { Username = "user 2", Score = 2 }
            };

            await Task.WhenAll(userScores.Select(score => db.KeyDeleteAsync(score.Username)));

            var leaderBoardProvider = new RedisLeaderBoardProvider(getRedis);
            var scoreBoard = new RedisScoreBoardStorage(getRedis);
            (await leaderBoardProvider.GetLeaderBoard())
                .UserScores
                .Should()
                .NotContain(userScores);

            await Task.WhenAll(userScores.Select(score => scoreBoard.Add(score)));

            var recordedScores = (await leaderBoardProvider.GetLeaderBoard()).UserScores;
            userScores.ForEach(score => recordedScores
                .Should()
                .ContainEquivalentOf(score));
        }

        // [Fact]
        public async Task LoadTest()
        {
            foreach (var i in Enumerable.Range(0, 100))
            {
                await StoresTheScore();
            }
        }
    }
}