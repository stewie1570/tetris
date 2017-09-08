using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System.Collections.Generic;
using System.Threading.Tasks;
using Tetris.Domain.Interfaces;
using Tetris.Domain.LeaderBoard;
using Tetris.Domain.Models;

namespace Tetris.Domain.Tests
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
                "Stewart",  //150
                "John"      //151
            };
            int randomScore = 150;
            config.MinScore = 100;
            config.MaxScore = 200;
            randomNumberGenerator
                .Get(min: config.MinScore, max: config.MaxScore)
                .Returns(ci => randomScore++);

            //Act
            var leaderBoard = await randomizedLeaderBoardProvider.GetLeaderBoard();
            
            //Assert
            leaderBoard.UserScores
                .ShouldBeEquivalentTo(new List<UserScore>
                {
                    new UserScore { Username = "Stewart", IsBot = true, Score = 150 },
                    new UserScore { Username = "John", IsBot = true, Score = 151 }
                });
        }
    }
}
