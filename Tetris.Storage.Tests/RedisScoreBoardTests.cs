using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using StackExchange.Redis;
using Tetris.Domain.Interfaces;
using Tetris.Domain.Models;
using Xunit;

namespace Tetris.Storage.Tests
{
    public class RedisScoreBoardTests
    {
        private IScoreBoardStorage scoreBoardStorage;

        public RedisScoreBoardTests()
        {
            scoreBoardStorage = new RedisScoreBoard();
        }

        [Fact]
        public async Task StoresTheScore()
        {
            var redis = await ConnectionMultiplexer.ConnectAsync("redis-18915.c62.us-east-1-4.ec2.cloud.redislabs.com:18915,password=9rUMjLjLVk8ld4zjfTZoHaj4cNYfoKmf");
            IDatabase db = redis.GetDatabase();
            (await db.StringGetAsync("key")).Should().Be("value");
        }
    }
}