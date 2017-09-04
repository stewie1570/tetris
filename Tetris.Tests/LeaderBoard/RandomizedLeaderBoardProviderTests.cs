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
        

        [TestInitialize]
        public void Setup()
        {
            randomNumberGenerator = Substitute.For<IRandonNumberGenerator>();

            randomizedLeaderBoardProvider = new RandomizedLeaderBoardProvider(
                randomNumberGenerator,
                getNames: () => Task.FromResult(names));
        }

        [TestMethod]
        public async Task ShouldReturnRandomizedListOfBotUsers()
        {
            //Arrange
            names = new string[]
            {
                "Stewart",
                "Jon",
                "Max"
            };
            randomNumberGenerator
                .Get(min: Arg.Is(0), max: Arg.Any<int>())
                .Returns(ci => ci.Args()[1]);
            randomNumberGenerator
                .Get(min: 100, max: 200)
                .Returns(150);

            //Act
            //Assert
            (await randomizedLeaderBoardProvider.GetUsers(minScore: 100, maxScore: 200))
                .ShouldBeEquivalentTo(new List<User>
                {
                    new User { Username = "Max", IsBot = true, Score = 150 },
                    new User { Username = "Jon", IsBot = true, Score = 150  },
                    new User { Username = "Stewart", IsBot = true, Score = 150 }
                }, ops => ops.WithStrictOrdering());
        }
    }
}
