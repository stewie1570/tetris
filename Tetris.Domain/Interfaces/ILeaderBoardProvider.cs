using System.Threading.Tasks;

namespace Tetris.Domain.Interfaces
{
    public interface ILeaderBoardProvider
    {
        Task<Models.LeaderBoard> GetLeaderBoard();
    }
}
