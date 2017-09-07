using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System.Collections.Generic;
using System.Threading.Tasks;
using Tetris.Domain;
using Tetris.Interfaces;
using Tetris.LeaderBoard;

namespace Tetris.Tests.LeaderBoard
{
    [TestClass]
    public class RandomizedLeaderBoardProviderTests
    {
        ILeaderBoardProvider randomizedLeaderBoardProvider;
        IRandonNumberGenerator randomNumberGenerator;
        string[] names;
        RandomUserProviderConfiguration config;
        

        [TestInitialize]
        public void Setup()
        {
            randomNumberGenerator = Substitute.For<IRandonNumberGenerator>();
            config = new RandomUserProviderConfiguration();
            randomizedLeaderBoardProvider = new RandomizedLeaderBoardProvider(
                randomNumberGenerator,
                config: config,
                getNames: () => Task.FromResult(names));
        }

        [TestMethod]
        public async Task ShouldReturnRandomizedListOfBotUsers()
        {
            //Arrange
            names = new string[]
            {
                "Jane",     //147
                "Jon",      //148
                "Max",      //149
                "Stewart",  //150
                "John"      //146
            };
            int randomScore = 147;
            config.MinScore = 100;
            config.MaxScore = 200;
            randomNumberGenerator
                .Get(min: config.MinScore, max: config.MaxScore)
                .Returns(ci => randomScore > 150 ? 146 : randomScore++);

            //Act
            var leaderBoard = await randomizedLeaderBoardProvider.GetLeaderBoard(userCount: 3);
            
            //Assert
            leaderBoard.Users
                .ShouldBeEquivalentTo(new List<User>
                {
                    new User { Username = "Stewart", IsBot = true, Score = 150 },
                    new User { Username = "Max", IsBot = true, Score = 149  },
                    new User { Username = "Jon", IsBot = true, Score = 148 }
                }, ops => ops.WithStrictOrdering());
        }
    }
}
