using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Tetris.Domain;

namespace Tetris.Controllers.Api
{
    public class UsersController : ApiController
    {
        List<User> users;

        public UsersController(Func<List<User>> getUsers)
        {
            this.users = getUsers();
        }

        [Route("api/users")]
        [HttpGet]
        public IEnumerable<dynamic> GetUsers()
        {
            return users.Select(user => new { user.Username, user.Score });
        }
    }
}
