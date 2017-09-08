using System.Linq;
using System.Threading.Tasks;
using Tetris.Core;
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

        public async Task AddUserScore(UserScore userScore)
        {
            var leaderBoard = await getLeaderBoard;

            leaderBoard.UserScores = leaderBoard
                .UserScores
                .Concat(userScore)
                .ToList();
        }
    }
}