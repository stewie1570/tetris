using System.Threading.Tasks;
using Tetris.Domain.Models;

namespace Tetris.Domain.Interfaces
{
    public interface ILeaderBoardStorage
    {
        Task Add(UserScore userScore);
    }
}
