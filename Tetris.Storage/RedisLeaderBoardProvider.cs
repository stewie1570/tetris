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
        private Task<ConnectionMultiplexer> redis;

        public RedisLeaderBoardProvider(Task<ConnectionMultiplexer> redis)
        {
            this.redis = redis;
        }

        public async Task<LeaderBoard> GetLeaderBoard()
        {
            return new LeaderBoard
            {
                UserScores = (
                        await (await redis)
                            .GetDatabase()
                            .SortedSetRangeByRankWithScoresAsync("user", 0, MaxScores - 1, Order.Descending)
                    )
                    .Select(userScore => new UserScore { Score = (int)userScore.Score, Username = userScore.Element })
                    .ToList()
            };
        }
    }
}