namespace Tetris.Domain.Models
{
    public class UserScore
    {
        public bool IsBot { get; set; }
        public int Score { get; set; }
        public string Username { get; set; }
    }
}