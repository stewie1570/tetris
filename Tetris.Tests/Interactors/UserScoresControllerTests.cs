using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NSubstitute;
using System.Collections.Generic;
using System.Threading.Tasks;
using Tetris.Domain.Interfaces;
using Tetris.Domain.Models;
using Tetris.Interactors;
using Tetris.Interfaces;

namespace Tetris.Tests.Interactors
{
    [TestClass]
    public class UserScoresControllerTests
    {
        IUserScoresInteractor userScoresInteractor;
        ILeaderBoardUpdater leaderBoardUpdater;
        LeaderBoard leaderBoard;

        [TestInitialize]
        public void Setup()
        {
            leaderBoard = new LeaderBoard();
            leaderBoardUpdater = Substitute.For<ILeaderBoardUpdater>();
            userScoresInteractor = new UserScoresInteractor(
                leaderBoardUpdater,
                getLeaderBoard: Task.FromResult(leaderBoard));
        }

        [TestMethod]
        public async Task GetuserScores()
        {
            //Arrange
            leaderBoard.UserScores = new List<UserScore>
            {
                new UserScore { Username = "Stewie", IsBot = true, Score = 102 },
                new UserScore { Username = "Max", IsBot = true, Score = 99 },
                new UserScore { Username = "John", IsBot = true, Score = 100 },
                new UserScore { Username = "Chris", IsBot = true, Score = 50 }
            };

            //Act
            //Assert
            (await userScoresInteractor.GetUserScores(count: 3)).ShouldBeEquivalentTo(new List<Models.UserScore>
            {
                new Models.UserScore { Username = "Stewie", Score = 102 },
                new Models.UserScore { Username = "John", Score = 100 },
                new Models.UserScore { Username = "Max", Score = 99 }
            }, ops => ops.WithStrictOrdering());
        }

        [TestMethod]
        public async Task AddUserScore()
        {
            //Arrange
            UserScore receivedUserScore = null;
            leaderBoardUpdater
                .When(updater => updater.Add(Arg.Any<UserScore>()))
                .Do(ci => receivedUserScore = ci.Arg<UserScore>());

            //Act
            await userScoresInteractor.Add(new Models.UserScore { Username = "Stewie", Score = 200 });

            //Assert
            receivedUserScore.ShouldBeEquivalentTo(new UserScore
            {
                Username = "Stewie",
                Score = 200
            });
        }
    }
}
