using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace Tetris.Hubs
{
    public class GameHub : Hub
    {
        public async Task Hello(object helloMessage)
        {
            await Clients.Others.SendAsync("Hello", helloMessage);
        }
    }
}