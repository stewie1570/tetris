using System;
using Tetris.Interfaces;

namespace Tetris
{
    public class RandomNumberGenerator : IRandonNumberGenerator
    {
        Random random = new Random();

        public int Get(int min, int max)
        {
            return random.Next(min, max);
        }
    }
}