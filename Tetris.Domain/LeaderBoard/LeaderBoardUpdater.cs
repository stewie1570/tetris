using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Tetris.Core.Exceptions;
using Tetris.Domain.Interfaces;
using Tetris.Domain.Models;

namespace Tetris.Domain.LeaderBoard
{
    public class LeaderBoardUpdater : ILeaderBoardUpdater
    {
        private const int maxUsernameLength = 20;
        private Func<Task<Models.LeaderBoard>> getLeaderBoard;
        private ILeaderBoardStorage scoreBoardStorage;

        public LeaderBoardUpdater(
            ILeaderBoardStorage scoreBoardStorage,
            Func<Task<Models.LeaderBoard>> getLeaderBoard)
        {
            this.scoreBoardStorage = scoreBoardStorage;
            this.getLeaderBoard = getLeaderBoard;
        }

        public async Task Add(UserScore userScore)
        {
            var trimmedUserScore = new UserScore { Username = userScore.Username.Trim(), Score = userScore.Score };

            if (trimmedUserScore.Username.Length > maxUsernameLength)
                throw new ValidationException($"Username length must not be over {maxUsernameLength}.");

            var leaderBoard = await getLeaderBoard();

            var firstRepeat = (leaderBoard.UserScores ?? new List<UserScore>())
                .FirstOrDefault(currentUserScore =>
                    trimmedUserScore.Username.ToLower() == currentUserScore.Username.ToLower()
                    && userScore.Score <= currentUserScore.Score);

            if(firstRepeat != null)
                throw new ValidationException($"{firstRepeat.Username} already has a score equal to or greater than {userScore.Score}.");

            await scoreBoardStorage.Add(trimmedUserScore);
        }
    }
}