using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Tetris.Domain.Interfaces;
using Tetris.Domain.Models;
using Xunit;

namespace Tetris.Storage.Tests
{
    public class InMemoryScoreBoardTests
    {
        IScoreBoardStorage scoreBoardStorage;
        LeaderBoard theLeaderBoard;

        public InMemoryScoreBoardTests()
        {
            theLeaderBoard = new LeaderBoard();
            scoreBoardStorage = new InMemoryScoreBoard(getLeaderBoard: Task.FromResult(theLeaderBoard));
        }

        [Fact]
        public async Task ShouldAddTheUserScore()
        {
            //Arrange
            var userScore = new UserScore { Username = "Stewie", Score = 100 };

            //Act
            await scoreBoardStorage.Add(userScore);

            //Assert
            theLeaderBoard.UserScores.Should().BeEquivalentTo(new List<UserScore>
            {
                userScore
            });
        }

        [Fact]
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
            theLeaderBoard.UserScores.Should().BeEquivalentTo(new List<UserScore>
            {
                new UserScore { Username = "John", Score = 100 },
                new UserScore { Username = "Stewie", Score = 50 },
                new UserScore { Username = "Max", Score = 300 }
            });
        }
    }
}
