using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using Tetris.Domain;

namespace Tetris.Controllers.Api
{
    public class UsersController : ApiController
    {
        Task<List<User>> getUsers;

        public UsersController(Func<Task<List<User>>> getUsers)
        {
            this.getUsers = getUsers();
        }

        [Route("api/users")]
        [HttpGet]
        public async Task<IEnumerable<dynamic>> GetUsers()
        {
            return (await getUsers).Select(user => new { user.Username, user.Score });
        }
    }
}
