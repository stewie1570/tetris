using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using NewRelic.Api.Agent;

namespace Tetris.Hubs
{
    public class GroupMessage
    {
        public string GroupId { get; set; }
        public JsonElement Message { get; set; }
    }

    public class GameHub : Hub
    {
        [Transaction(Web = true)]
        public async Task Hello(GroupMessage helloMessage)
        {
            string groupId = helloMessage.GroupId;
            string userId = helloMessage.Message.GetProperty("userId").GetString();
            var isOrganizer = userId == groupId;
            Context.Items.Add("userId", userId);
            Context.Items.Add("groupId", groupId);

            await Task.WhenAll(
                Groups.AddToGroupAsync(Context.ConnectionId, groupId),
                Groups.AddToGroupAsync(Context.ConnectionId, isOrganizer ? $"{groupId}-organizer" : $"{groupId}-players")
            );

            if (isOrganizer)
            {
                await Clients.Group(groupId).SendAsync("reset");
            }
            else
            {
                await Clients.Group($"{groupId}-organizer").SendAsync("hello", helloMessage.Message);
            }
        }

        [Transaction(Web = true)]
        public async Task PlayersListUpdate(GroupMessage playersListUpdateMessage)
        {
            await Clients
                .Group($"{playersListUpdateMessage.GroupId}-players")
                .SendAsync("playersListUpdate", playersListUpdateMessage.Message);
        }

        [Transaction(Web = true)]
        public async Task Status(GroupMessage statusMessage)
        {
            var sendToAll = statusMessage
                .Message
                .EnumerateObject()
                .Any(prop => prop.Name == "name" && prop.Value.ValueKind == JsonValueKind.String);

            await (sendToAll
                ? Clients.Group(statusMessage.GroupId)
                : Clients.OthersInGroup(statusMessage.GroupId))
                .SendAsync("status", statusMessage.Message);
        }

        [Transaction(Web = true)]
        public async Task Start(GroupMessage statusMessage)
        {
            await Clients.Group(statusMessage.GroupId).SendAsync("start");
        }

        [Transaction(Web = true)]
        public async Task Results(GroupMessage resultsMessage)
        {
            await Clients.Group(resultsMessage.GroupId).SendAsync("results", resultsMessage.Message);
        }

        [Transaction(Web = true)]
        public async Task Reset(GroupMessage resetMessage)
        {
            await Clients.Group(resetMessage.GroupId).SendAsync("reset");
        }

        [Transaction(Web = true)]
        public async override Task OnDisconnectedAsync(System.Exception exception)
        {
            var groupId = Context.Items["groupId"] as string;
            var userId = Context.Items["userId"] as string;
            var isOrganizer = groupId == userId;

            await (isOrganizer
                ? Clients.Group(groupId).SendAsync("noOrganizer")
                : Clients.Group($"{groupId}-organizer").SendAsync("disconnect", new { userId }));
        }
    }
}