﻿using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Tetris.Interfaces;
using Tetris.Models;

namespace Tetris.Controllers.Api
{
    public class UserScoresController : Controller
    {
        IUserScoresInteractor userScoreInteractor;

        public UserScoresController(IUserScoresInteractor userScoreInteractor)
        {
            this.userScoreInteractor = userScoreInteractor;
        }

        [Route("api/userScores")]
        [HttpGet]
        public async Task<IEnumerable<Models.UserScore>> GetUserScores()
        {
            return await userScoreInteractor.GetUserScores(count: 20);
        }

        [Route("api/userScores")]
        [HttpPost]
        public async Task AddUserScore([FromBody] UserScore userScore)
        {
            await userScoreInteractor.Add(userScore);
        }
    }
}
