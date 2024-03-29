﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Tetris.Domain.Interfaces;
using Tetris.Domain.Models;
using Tetris.Interfaces;

namespace Tetris.Interactors
{
    public class UserScoresInteractor : IUserScoresInteractor
    {
        private Func<Task<LeaderBoard>> getLeaderBoard;
        private ILeaderBoardUpdater leaderBoardUpdater;

        public UserScoresInteractor(
            ILeaderBoardUpdater leaderBoardUpdater,
            Func<Task<LeaderBoard>> getLeaderBoard)
        {
            this.leaderBoardUpdater = leaderBoardUpdater;
            this.getLeaderBoard = getLeaderBoard;
        }

        public async Task Add(Models.UserScore userScore)
        {
            await leaderBoardUpdater.Add(new UserScore
            {
                Score = userScore.Score,
                Username = userScore.Username
            });
        }

        public async Task<List<Models.UserScore>> GetUserScores(int count)
        {
            return (await getLeaderBoard())
                .UserScores
                .OrderByDescending(userScore => userScore.Score)
                .Take(count)
                .Select(userScore => new Models.UserScore
                {
                    Username = userScore.Username,
                    Score = userScore.Score
                })
                .ToList();
        }
    }
}