using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Tetris.Core;
using Tetris.Core.Exceptions;
using Tetris.Domain.Interfaces;
using Tetris.Domain.Models;

namespace Tetris.Domain.LeaderBoard
{
    public class InMemoryLeaderBoardUpdater : ILeaderBoardUpdater
    {
        private Task<Models.LeaderBoard> getLeaderBoard;

        public InMemoryLeaderBoardUpdater(Task<Models.LeaderBoard> getLeaderBoard)
        {
            this.getLeaderBoard = getLeaderBoard;
        }

        public async Task Add(UserScore userScore)
        {
            var trimmedUserScore = new UserScore
            {
                Username = userScore.Username.Trim(),
                Score = userScore.Score
            };
            var leaderBoard = await getLeaderBoard;

            var firstRepeat = (leaderBoard.UserScores ?? new List<UserScore>())
                .FirstOrDefault(currentUserScore =>
                    trimmedUserScore.Username.ToLower() == currentUserScore.Username.ToLower()
                    && userScore.Score <= currentUserScore.Score);

            if(firstRepeat != null)
                throw new ValidationException($"{firstRepeat.Username} already has a score equal to or greater than {userScore.Score}.");

            leaderBoard.UserScores = (leaderBoard.UserScores ?? new List<UserScore>())
                .Where(currentUserScore => currentUserScore.Username.ToLower() != trimmedUserScore.Username.ToLower())
                .Concat(trimmedUserScore)
                .ToList();
        }
    }
}