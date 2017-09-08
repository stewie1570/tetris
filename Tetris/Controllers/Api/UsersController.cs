using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;

namespace Tetris.Controllers.Api
{
    public class UsersController : ApiController
    {
        Task<Domain.LeaderBoard> getLeaderBoard;

        public UsersController(Func<Task<Domain.LeaderBoard>> getLeaderBoard)
        {
            this.getLeaderBoard = getLeaderBoard();
        }

        [Route("api/users")]
        [HttpGet]
        public async Task<IEnumerable<dynamic>> GetUsers()
        {
            return (await getLeaderBoard).UserScores.Select(user => new { user.Username, user.Score });
        }
    }
}
