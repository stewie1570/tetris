using System.Threading.Tasks;
using StackExchange.Redis;
using Tetris.Domain.Interfaces;
using Tetris.Domain.Models;

namespace Tetris.Storage
{
    public class RedisScoreBoardStorage : IScoreBoardStorage
    {
        private Task<ConnectionMultiplexer> redis;

        public RedisScoreBoardStorage(Task<ConnectionMultiplexer> redis)
        {
            this.redis = redis;
        }

        public async Task Add(UserScore userScore)
        {
            await (await redis)
                .GetDatabase()
                .SortedSetAddAsync("user", userScore.Username, userScore.Score);
        }
    }
}