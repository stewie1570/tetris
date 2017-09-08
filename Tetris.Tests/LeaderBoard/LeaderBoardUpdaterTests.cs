using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using System.Threading.Tasks;
using Tetris.Domain;
using Tetris.Interfaces;
using Tetris.LeaderBoard;

namespace Tetris.Tests.LeaderBoard
{
    [TestClass]
    public class LeaderBoardUpdaterTests
    {
        ILeaderBoardUpdater leaderBoardUpdater;
        Domain.LeaderBoard leaderBoard;

        [TestInitialize]
        public void Setup()
        {
            leaderBoard = new Domain.LeaderBoard();
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
