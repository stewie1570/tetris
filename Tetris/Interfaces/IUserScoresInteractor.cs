using System.Collections.Generic;
using System.Threading.Tasks;
using Tetris.Models;

namespace Tetris.Interfaces
{
    public interface IUserScoresInteractor
    {
        Task<List<Models.UserScore>> GetUserScores(int count);
        Task Add(UserScore userScore);
    }
}
