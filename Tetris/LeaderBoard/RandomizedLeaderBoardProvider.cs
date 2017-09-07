using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Tetris.Domain;
using Tetris.Interfaces;

namespace Tetris.LeaderBoard
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

        public async Task<List<User>> GetUsers(int count)
        {
            return (await getNames())
                .Select(name => new User
                {
                    IsBot = true,
                    Score = randomNumberGenerator.Get(config.MinScore, config.MaxScore),
                    Username = name
                })
                .OrderByDescending(user => user.Score)
                .Take(count)
                .ToList();
        }
    }
}