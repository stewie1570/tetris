using System;
using System.Linq;
using System.Threading.Tasks;
using Tetris.Domain.Interfaces;
using Tetris.Domain.Models;

namespace Tetris.Domain.LeaderBoard
{
    public class RandomUserProviderConfiguration
    {
        public int MinScore { get; set; }
        public int MaxScore { get; set; }
    }

    public class RandomizedLeaderBoardProvider : ILeaderBoardProvider
    {
        Func<Task<string[]>> getNames;
        IRandonNumberGenerator randomNumberGenerator;
        RandomUserProviderConfiguration config;

        public RandomizedLeaderBoardProvider(
            IRandonNumberGenerator randomNumberGenerator,
            RandomUserProviderConfiguration config,
            Func<Task<string[]>> getNames)
        {
            this.randomNumberGenerator = randomNumberGenerator;
            this.config = config;
            this.getNames = getNames;
        }

        public async Task<Models.LeaderBoard> GetLeaderBoard()
        {
            return new Models.LeaderBoard
            {
                UserScores = (await getNames())
                    .Select(name => new UserScore
                    {
                        IsBot = true,
                        Score = randomNumberGenerator.Get(config.MinScore, config.MaxScore),
                        Username = name
                    })
                    .ToList()
            };
        }
    }
}