using System.Threading.Tasks;
using StackExchange.Redis;
using Tetris.Domain.Interfaces;
using Tetris.Domain.Models;

namespace Tetris.Storage
{
    public class RedisLeaderBoardStorage : ILeaderBoardStorage
    {
        private readonly Task<ConnectionMultiplexer> gettingRedis;

        public RedisLeaderBoardStorage(Task<ConnectionMultiplexer> gettingRedis)
        {
            this.gettingRedis = gettingRedis;
        }

        public async Task Add(UserScore userScore)
        {
            await (await gettingRedis)
                .GetDatabase()
                .SortedSetAddAsync("user", userScore.Username, userScore.Score);
        }
    }
}