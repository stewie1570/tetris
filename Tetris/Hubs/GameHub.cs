using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace Tetris.Hubs
{
    public class GroupMessage<T>
    {
        public string GroupId { get; set; }
        public T Message { get; set; }
    }

    public class GameHub : Hub
    {
        public async Task Hello(GroupMessage<object> helloMessage)
        {
            string groupId = helloMessage.GroupId;
            await Groups.AddToGroupAsync(Context.ConnectionId, groupId);
            await Clients.OthersInGroup(groupId).SendAsync("hello", helloMessage.Message);
        }
    }
}