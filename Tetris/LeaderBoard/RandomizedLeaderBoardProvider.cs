using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Tetris.Core;
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

        public async Task<List<User>> GetUsers()
        {
            return GetRandomUserList(names: (await getNames()).ToList());
        }

        #region Helpers

        private List<User> GetRandomUserList(List<string> names, List<User> currentList = null)
        {
            Func<List<User>> newUserList = () =>
            {
                int randomNumber = randomNumberGenerator.Get(min: 0, max: names.Count - 1);

                return GetRandomUserList(
                    currentList: (currentList ?? new List<User>())
                        .Concat(NewUserFrom(names, randomNumber))
                        .ToList(),
                    names: names
                        .Where((name, index) => index != randomNumber)
                        .ToList());
            };

            return names.Count == 0 ? currentList : newUserList();
        }

        private User NewUserFrom(List<string> names, int randomNumber)
        {
            return new User
            {
                Username = names[randomNumber],
                IsBot = true,
                Score = randomNumberGenerator.Get(config.MinScore, config.MaxScore)
            };
        }

        #endregion
    }
}