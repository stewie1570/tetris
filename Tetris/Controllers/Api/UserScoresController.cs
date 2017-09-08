using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;
using Tetris.Interfaces;
using Tetris.Models;

namespace Tetris.Controllers.Api
{
    public class UserScoresController : ApiController
    {
        IUserScoresInteractor userScoreInteractor;

        public UserScoresController(IUserScoresInteractor userScoreInteractor)
        {
            this.userScoreInteractor = userScoreInteractor;
        }

        [Route("api/userScores")]
        [HttpGet]
        public async Task<IEnumerable<Models.UserScore>> GetUserScores()
        {
            return await userScoreInteractor.GetUserScores(count: 20);
        }

        [Route("api/userScores")]
        [HttpPost]
        public async Task AddUserScore(UserScore userScore)
        {
            await userScoreInteractor.Add(userScore);
        }
    }
}
