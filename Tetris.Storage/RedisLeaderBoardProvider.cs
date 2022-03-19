using System.Linq;
using System.Threading.Tasks;
using StackExchange.Redis;
using Tetris.Domain.Interfaces;
using Tetris.Domain.Models;

namespace Tetris.Storage
{
    public class RedisLeaderBoardProvider : ILeaderBoardProvider
    {
        public int MaxScores { get; set; } = 20;
        private Task<ConnectionMultiplexer> gettingRedis;

        public RedisLeaderBoardProvider(Task<ConnectionMultiplexer> gettingRedis)
        {
            this.gettingRedis = gettingRedis;
        }

        public async Task<LeaderBoard> GetLeaderBoard()
        {
            return new LeaderBoard
            {
                UserScores = (
                        await (await gettingRedis)
                            .GetDatabase()
                            .SortedSetRangeByRankWithScoresAsync("user", 0, MaxScores - 1, Order.Descending)
                    )
                    .Select(userScore => new UserScore { Score = (int)userScore.Score, Username = userScore.Element })
                    .ToList()
            };
        }
    }
}