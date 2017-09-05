using System.Collections.Generic;
using System.Threading.Tasks;
using Tetris.Domain;

namespace Tetris.Interfaces
{
    public interface ILeaderBoardProvider
    {
        Task<List<User>> GetUsers();
    }
}
