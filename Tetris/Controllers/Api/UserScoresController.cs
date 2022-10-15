using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Tetris.Interfaces;
using Tetris.Models;

namespace Tetris.Controllers.Api
{
    public class UserScoresController : Controller
    {
        readonly IUserScoresInteractor userScoreInteractor;

        public UserScoresController(IUserScoresInteractor userScoreInteractor)
        {
            this.userScoreInteractor = userScoreInteractor;
        }

        [Route("api/userScores")]
        [HttpGet]
        [HttpHead]
        public async Task<IEnumerable<UserScore>> GetUserScores()
        {
            return await userScoreInteractor.GetUserScores(count: 20);
        }

        [Route("api/userScores")]
        [HttpPost]
        public async Task AddUserScore([FromBody] UserScore userScore)
        {
            await userScoreInteractor.Add(userScore);
        }
    }
}
