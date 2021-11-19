using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace Tetris.Hubs
{
    public class GroupMessage<T>
    {
        public string groupId { get; set; }
        public T message { get; set; }
    }

    public class GameHub : Hub
    {
        public async Task Hello(GroupMessage<object> helloMessage)
        {
            try
            {
                string groupId = helloMessage.groupId;
                await Groups.AddToGroupAsync(Context.ConnectionId, groupId);
                await Clients.OthersInGroup(groupId).SendAsync("hello", helloMessage.message);
            }
            catch (System.Exception e)
            {
                System.Console.WriteLine(e);
                throw;
            }
        }
    }
}