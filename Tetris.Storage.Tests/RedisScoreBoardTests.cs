using System;
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

        [Theory]
        [InlineData(0)]
        public async Task StoresTheScore(int start)
        {
            IDatabase db = (await getRedis).GetDatabase();

            var userScores = new List<UserScore>{
                new UserScore { Username = $"user {start}", Score = 10 },
                new UserScore { Username = $"user {start + 1}", Score = 3 },
                new UserScore { Username = $"user {start + 2}", Score = 1 },
                new UserScore { Username = $"user {start + 3}", Score = 5 },
                new UserScore { Username = $"user {start + 4}", Score = 2 }
            };
            var leaderBoardProvider = new RedisLeaderBoardProvider(getRedis) { MaxScores = 1000 };
            var scoreBoard = new RedisScoreBoardStorage(getRedis);

            await Task.WhenAll(userScores.Select(score => db.KeyDeleteAsync(score.Username)));
            (await leaderBoardProvider.GetLeaderBoard())
                .UserScores
                .Should()
                .NotContain(userScores);

            await Task.WhenAll(userScores.Select(score => scoreBoard.Add(score)));
            var recordedScores = (await leaderBoardProvider.GetLeaderBoard()).UserScores;
            userScores.ForEach(score => recordedScores
                .Should()
                .ContainEquivalentOf(score));

            await Task.WhenAll(userScores.Select(score => db.KeyDeleteAsync(score.Username)));
            (await leaderBoardProvider.GetLeaderBoard())
                .UserScores
                .Should()
                .NotContain(userScores);
        }

        [Fact]
        public async Task LoadTest()
        {
            foreach (var i in Enumerable.Range(0, 100))
            {
                await StoresTheScore(start: i * 10);
            }
        }
    }
}