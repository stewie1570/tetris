using System.Collections.Generic;

namespace Tetris.Domain.Models
{
    public class LeaderBoard
    {
        public List<UserScore> UserScores { get; set; }
    }
}