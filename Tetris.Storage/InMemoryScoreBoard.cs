using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Tetris.Core;
using Tetris.Domain.Interfaces;
using Tetris.Domain.Models;

namespace Tetris.Storage
{
    public class InMemoryScoreBoard : IScoreBoardStorage
    {
        private Task<LeaderBoard> getLeaderBoard;

        public InMemoryScoreBoard(Task<LeaderBoard> getLeaderBoard)
        {
            this.getLeaderBoard = getLeaderBoard;
        }

        public async Task Add(UserScore userScoreToAdd)
        {
            var leaderBoard = await getLeaderBoard;

            leaderBoard.UserScores = (leaderBoard.UserScores ?? new List<UserScore>())
                .Where(userScore => userScore.Username.ToLower() != userScoreToAdd.Username.ToLower())
                .Concat(userScoreToAdd)
                .ToList();
        }
    }
}
