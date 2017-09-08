using System.Threading.Tasks;
using Tetris.Domain.Models;

namespace Tetris.Domain.Interfaces
{
    public interface ILeaderBoardUpdater
    {
        Task Add(UserScore userScore);
    }
}
