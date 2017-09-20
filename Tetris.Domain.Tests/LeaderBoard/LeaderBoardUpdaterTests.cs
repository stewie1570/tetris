using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Tetris.Core.Exceptions;
using Tetris.Domain.Interfaces;
using Tetris.Domain.LeaderBoard;
using Tetris.Domain.Models;

namespace Tetris.Domain.Tests.LeaderBoard
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
        public async Task AddsTrimmedNewUserRecord()
        {
            //Arrange
            var userScore = new UserScore { Score = 10, Username = "Stewie " };

            //Act
            await leaderBoardUpdater.Add(userScore);

            //Assert
            leaderBoard.UserScores.ShouldBeEquivalentTo(new List<UserScore>
            {
                 new UserScore { Score = 10, Username = "Stewie" }
            });
        }

        [TestMethod]
        public async Task DoesNotAddScoreForUserThatExistsWithSameOrHigherScore()
        {
            //Arrange
            leaderBoard.UserScores = new List<UserScore> { new UserScore { Score = 10, Username = "stewie" } };

            //Act
            //Assert
            ((Func<Task>)(async () => await leaderBoardUpdater.Add(new UserScore { Score = 10, Username = "Stewie" })))
                .ShouldThrow<ValidationException>()
                .WithMessage("Stewie already has a score equal to or greater than 10.");

            leaderBoard.UserScores.ShouldBeEquivalentTo(new List<UserScore>
            {
                new UserScore { Score = 10, Username = "stewie" }
            });
        }

        [TestMethod]
        public async Task ReplacesOldLowerScoreWithNewHigherScore()
        {
            //Arrange
            leaderBoard.UserScores = new List<UserScore>
            {
                new UserScore { Score = 9, Username = "John" },
                new UserScore { Score = 10, Username = "Stewie" },
                new UserScore { Score = 12, Username = "Max" }
            };

            //Act
            //Assert
            await leaderBoardUpdater.Add(new UserScore { Score = 18, Username = "stewie" });

            leaderBoard.UserScores.ShouldBeEquivalentTo(new List<UserScore>
            {
                new UserScore { Score = 9, Username = "John" },
                new UserScore { Score = 18, Username = "stewie" },
                new UserScore { Score = 12, Username = "Max" }
            });
        }
    }
}
