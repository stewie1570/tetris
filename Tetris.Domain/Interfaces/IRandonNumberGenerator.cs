namespace Tetris.Domain.Interfaces
{
    public interface IRandonNumberGenerator
    {
        int Get(int min, int max);
    }
}