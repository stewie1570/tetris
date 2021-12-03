using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace Tetris.Hubs
{
    public class GroupMessage
    {
        public string GroupId { get; set; }
        public JsonElement Message { get; set; }
    }

    public class GameHub : Hub
    {
        public async Task Hello(GroupMessage helloMessage)
        {
            string groupId = helloMessage.GroupId;
            var isOrganizer = helloMessage.Message.GetProperty("userId").GetString() == groupId;

            await Task.WhenAll(
                Groups.AddToGroupAsync(Context.ConnectionId, groupId),
                isOrganizer
                    ? Groups.AddToGroupAsync(Context.ConnectionId, $"{groupId}-organizer")
                    : Groups.AddToGroupAsync(Context.ConnectionId, $"{groupId}-players"),
                isOrganizer
                    ? Task.CompletedTask
                    : Clients.Group($"{groupId}-organizer").SendAsync("hello", (object)helloMessage.Message)
            );
        }

        public async Task PlayersListUpdate(GroupMessage playersListUpdateMessage)
        {
            await Clients
                .Group($"{playersListUpdateMessage.GroupId}-players")
                .SendAsync("playersListUpdate", playersListUpdateMessage.Message);
        }
    }
}