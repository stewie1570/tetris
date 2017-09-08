using System.Threading.Tasks;
using Tetris.Domain;

namespace Tetris.Interfaces
{
    public interface ILeaderBoardUpdater
    {
        Task AddUserScore(UserScore userScore);
    }
}
