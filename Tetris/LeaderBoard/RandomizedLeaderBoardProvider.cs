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
        private Func<Task<string[]>> getNames;
        private IRandonNumberGenerator randomNumberGenerator;
        public List<User> CurrentUsers { get; set; } = new List<User>();

        public RandomizedLeaderBoardProvider(
            IRandonNumberGenerator randomNumberGenerator,
            Func<Task<string[]>> getNames)
        {
            this.randomNumberGenerator = randomNumberGenerator;
            this.getNames = getNames;
        }

        public async Task<List<User>> GetUsers(int minScore, int maxScore)
        {
            return GetRandomUserList(
                config: new RandomUserProviderConfiguration { MinScore = minScore, MaxScore = maxScore },
                currentList: CurrentUsers,
                names: (await getNames()).ToList());
        }

        #region Helpers

        private List<User> GetRandomUserList(
            RandomUserProviderConfiguration config,
            List<User> currentList,
            List<string> names)
        {
            Func<List<User>> newUserList = () =>
            {
                int randomNumber = randomNumberGenerator.Get(min: 0, max: names.Count - 1);

                return GetRandomUserList(
                    config,
                    currentList: currentList
                        .Concat(NewUserFrom(config, names, randomNumber))
                        .ToList(),
                    names: names
                        .Where((name, index) => index != randomNumber)
                        .ToList());
            };

            return names.Count == 0 ? currentList : newUserList();
        }

        private User NewUserFrom(RandomUserProviderConfiguration config, List<string> names, int randomNumber)
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