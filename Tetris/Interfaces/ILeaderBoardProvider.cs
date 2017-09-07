using System.Threading.Tasks;

namespace Tetris.Interfaces
{
    public interface ILeaderBoardProvider
    {
        Task<Domain.LeaderBoard> GetLeaderBoard(int userCount);
    }
}
