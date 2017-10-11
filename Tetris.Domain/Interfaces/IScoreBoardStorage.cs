using System.Threading.Tasks;
using Tetris.Domain.Models;

namespace Tetris.Domain.Interfaces
{
    public interface IScoreBoardStorage
    {
        Task Add(UserScore userScore);
    }
}
