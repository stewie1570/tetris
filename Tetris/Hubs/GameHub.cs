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
            await Task.WhenAll(
                Groups.AddToGroupAsync(Context.ConnectionId, groupId),
                Clients.OthersInGroup(groupId).SendAsync("hello", helloMessage.Message)
            );
        }
    }
}