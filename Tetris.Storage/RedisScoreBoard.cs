using System.Threading.Tasks;
using Tetris.Domain.Interfaces;
using Tetris.Domain.Models;

namespace Tetris.Storage
{
    public class RedisScoreBoard : IScoreBoardStorage
    {
        public Task Add(UserScore userScore)
        {
            return Task.FromResult(0);
        }
    }
}