using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using Tetris.Interfaces;
using Tetris.Models;

namespace Tetris.Controllers.Api
{
    public class UserScoresController : ApiController
    {
        Task<Domain.LeaderBoard> getLeaderBoard;
        ILeaderBoardUpdater leaderBoardUpdater;

        public UserScoresController(Func<Task<Domain.LeaderBoard>> getLeaderBoard, ILeaderBoardUpdater leaderBoardUpdater)
        {
            this.getLeaderBoard = getLeaderBoard();
            this.leaderBoardUpdater = leaderBoardUpdater;
        }

        [Route("api/userScores")]
        [HttpGet]
        public async Task<IEnumerable<dynamic>> GetUserScores()
        {
            return (await getLeaderBoard).UserScores.Select(user => new { user.Username, user.Score });
        }

        [Route("api/userScores")]
        [HttpPost]
        public async Task AddUserScore(UserScore userScore)
        {
            await leaderBoardUpdater.AddUserScore(new Domain.UserScore
            {
                Score = userScore.Score,
                Username = userScore.UserName
            });
        }
    }
}
