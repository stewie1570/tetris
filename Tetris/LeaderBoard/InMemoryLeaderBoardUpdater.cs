using System.Linq;
using System.Threading.Tasks;
using Tetris.Core;
using Tetris.Domain;
using Tetris.Interfaces;

namespace Tetris.LeaderBoard
{
    public class InMemoryLeaderBoardUpdater : ILeaderBoardUpdater
    {
        private Task<Domain.LeaderBoard> getLeaderBoard;

        public InMemoryLeaderBoardUpdater(Task<Domain.LeaderBoard> getLeaderBoard)
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