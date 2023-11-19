using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Tetris.Domain.Interfaces;
using Tetris.Domain.Models;

namespace Tetris.Controllers.Api;

public class GameRoomController : Controller
{
    private readonly IGameRoomRepo gameRoomRepo;

    public GameRoomController(IGameRoomRepo gameRoomRepo)
    {
        this.gameRoomRepo = gameRoomRepo;
    }

    [HttpGet]
    [Route("api/gameRooms")]
    public async Task<List<GameRoom>> GetGameRooms()
    {
        return await gameRoomRepo.GetGameRooms(0, 10);
    }
}