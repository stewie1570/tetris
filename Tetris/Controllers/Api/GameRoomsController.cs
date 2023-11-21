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
    public async Task<Page<GameRoom>> GetGameRooms(
        [FromQuery] int start,
        [FromQuery] int count
    )
    {
        return await gameRoomRepo.GetGameRooms(start, count);
    }
}