using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using StackExchange.Redis;
using Tetris.Core;
using Tetris.Domain.Models;
using Xunit;

namespace Tetris.Storage.Tests
{
    public class RedisScoreBoardTests
    {
        private Task<ConnectionMultiplexer> getRedis;

        public RedisScoreBoardTests()
        {
            getRedis = ConnectionMultiplexer.ConnectAsync(
                TestConfigContainer.GetConfig()["RedisConnectionString"]
                );
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
            var leaderBoardProvider = new RedisLeaderBoardProvider(getRedis) { MaxScores = 10000 };
            var scoreBoard = new RedisLeaderBoardStorage(getRedis);

            await Task.WhenAll(userScores
                .Select(userScore => db.SortedSetRemoveAsync("user", userScore.Username)));
            (await leaderBoardProvider.GetLeaderBoard())
                .UserScores
                .Should()
                .NotContain(userScores);

            await Task.WhenAll(userScores.Select(score => scoreBoard.Add(score)));
            var recordedScores = (await leaderBoardProvider.GetLeaderBoard()).UserScores;
            userScores.ForEach(score => recordedScores
                .Should()
                .ContainEquivalentOf(score));
            await Task.WhenAll(userScores
                .Select(userScore => db.SortedSetRemoveAsync("user", userScore.Username)));
        }

        [Fact]
        public async Task LoadTest()
        {
            const int count = 5000;
            var db = (await getRedis).GetDatabase();
            var usernames = Enumerable
                .Range(start: 0, count: count + 5)
                .Select(i => $"user {i}")
                .ToList();

            await Task.WhenAll(usernames
                .Select(username => db.SortedSetRemoveAsync("user", username)));

            await ConcurrentTask.WhenAll(Enumerable
                .Range(start: 1, count: count)
                .Select(i => (Func<Task>)(() => StoresTheScore(start: i * 10))),
                maxConcurrency: 100);
        }
    }
}