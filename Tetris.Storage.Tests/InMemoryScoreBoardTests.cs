using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using System.Threading.Tasks;
using Tetris.Domain.Interfaces;
using Tetris.Domain.Models;

namespace Tetris.Storage.Tests
{
    [TestClass]
    public class InMemoryScoreBoardTests
    {
        IScoreBoardStorage scoreBoardStorage;
        LeaderBoard theLeaderBoard;

        [TestInitialize]
        public void Setup()
        {
            theLeaderBoard = new LeaderBoard();
            scoreBoardStorage = new InMemoryScoreBoard(getLeaderBoard: Task.FromResult(theLeaderBoard));
        }

        [TestMethod]
        public async Task ShouldAddTheUserScore()
        {
            //Arrange
            var userScore = new UserScore { Username = "Stewie", Score = 100 };

            //Act
            await scoreBoardStorage.Add(userScore);

            //Assert
            theLeaderBoard.UserScores.ShouldBeEquivalentTo(new List<UserScore>
            {
                userScore
            });
        }

        [TestMethod]
        public async Task ShouldUpdateExistingScore()
        {
            //Arrange
            theLeaderBoard.UserScores = new List<UserScore>
            {
                new UserScore { Username = "John", Score = 100 },
                new UserScore { Username = "stewie", Score = 200 },
                new UserScore { Username = "Max", Score = 300 }
            };

            //Act
            await scoreBoardStorage.Add(new UserScore { Username = "Stewie", Score = 50 });

            //Assert
            theLeaderBoard.UserScores.ShouldBeEquivalentTo(new List<UserScore>
            {
                new UserScore { Username = "John", Score = 100 },
                new UserScore { Username = "Stewie", Score = 50 },
                new UserScore { Username = "Max", Score = 300 }
            });
        }
    }
}
