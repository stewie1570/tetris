using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using System.Threading.Tasks;
using Tetris.Domain.Interfaces;
using Tetris.Domain.LeaderBoard;
using Tetris.Domain.Models;

namespace Tetris.Domain.Tests
{
    [TestClass]
    public class LeaderBoardUpdaterTests
    {
        ILeaderBoardUpdater leaderBoardUpdater;
        Models.LeaderBoard leaderBoard;

        [TestInitialize]
        public void Setup()
        {
            leaderBoard = new Models.LeaderBoard();
            leaderBoardUpdater = new InMemoryLeaderBoardUpdater(Task.FromResult(leaderBoard));
        }

        [TestMethod]
        public async Task AddsNewUserRecord()
        {
            //Arrange
            var userScore = new UserScore
            {
                Score = 10,
                Username = "Stewie"
            };

            //Act
            await leaderBoardUpdater.AddUserScore(userScore);

            //Assert
            leaderBoard.UserScores.ShouldBeEquivalentTo(new List<UserScore>
            {
                userScore
            });
        }
    }
}
