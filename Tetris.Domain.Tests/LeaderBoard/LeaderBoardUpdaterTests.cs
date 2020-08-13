using FluentAssertions;
using NSubstitute;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Tetris.Core.Exceptions;
using Tetris.Domain.Interfaces;
using Tetris.Domain.LeaderBoard;
using Tetris.Domain.Models;
using Xunit;

namespace Tetris.Domain.Tests.LeaderBoard
{
    public class LeaderBoardUpdaterTests
    {
        ILeaderBoardUpdater leaderBoardUpdater;
        IScoreBoardStorage scoreBoardStorage;
        Models.LeaderBoard leaderBoard;

        public LeaderBoardUpdaterTests()
        {
            leaderBoard = new Models.LeaderBoard();
            scoreBoardStorage = Substitute.For<IScoreBoardStorage>();
            leaderBoardUpdater = new LeaderBoardUpdater(
                scoreBoardStorage,
                getLeaderBoard: Task.FromResult(leaderBoard));
        }

        [Fact]
        public async Task AddsTrimmedNewUserRecord()
        {
            //Arrange
            var userScore = new UserScore { Score = 10, Username = "Stewie                                         " };
            UserScore receivedUserScore = null;
            scoreBoardStorage
                .When(storage => storage.Add(Arg.Any<UserScore>()))
                .Do(ci => receivedUserScore = ci.Arg<UserScore>());

            //Act
            await leaderBoardUpdater.Add(userScore);

            //Assert
            receivedUserScore.Should().BeEquivalentTo(new UserScore { Score = 10, Username = "Stewie" });
        }

        [Fact]
        public async Task DoesNotAddScoreForUserThatExistsWithSameOrHigherScore()
        {
            //Arrange
            leaderBoard.UserScores = new List<UserScore> { new UserScore { Score = 10, Username = "stewie" } };

            //Act
            //Assert
            (await ((Func<Task>)(async () => await leaderBoardUpdater.Add(new UserScore { Score = 10, Username = "Stewie" })))
                .Should()
                .ThrowAsync<ValidationException>())
                .WithMessage("Stewie already has a score equal to or greater than 10.");

            await scoreBoardStorage.Received(0).Add(Arg.Any<UserScore>());
        }

        [Fact]
        public async Task DoesNotAddScoreForUsernamesThatAreTooLong()
        {
            //Arrange
            leaderBoard.UserScores = new List<UserScore> { new UserScore { Score = 10, Username = "stewie" } };

            //Act
            //Assert
            (await ((Func<Task>)(async () => await leaderBoardUpdater.Add(new UserScore { Score = 10, Username = "some really really long user name here" })))
                .Should()
                .ThrowAsync<ValidationException>())
                .WithMessage("Username length must not be over 20.");

            await scoreBoardStorage.Received(0).Add(Arg.Any<UserScore>());
        }
    }
}
