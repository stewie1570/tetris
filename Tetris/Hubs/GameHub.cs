using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using NewRelic.Api.Agent;
using Tetris.Domain;

namespace Tetris.Hubs
{
    public class GroupMessage
    {
        public string GroupId { get; set; }
        public JsonElement Message { get; set; }
    }

    public class GameHub : Hub
    {
        private readonly ILogger<GameHub> logger;

        public GameHub(ILogger<GameHub> logger)
        {
            this.logger = logger;
        }

        [Transaction(Web = true)]
        public async Task Hello(GroupMessage helloMessage)
        {
            string groupId = helloMessage.GroupId;
            string userId = helloMessage.Message.GetProperty("userId").GetString();
            bool isRunning = helloMessage.Message.GetProperty("isRunning").GetBoolean();
            var isOrganizer = userId == groupId;
            Context.Items["userId"] = userId;
            Context.Items["groupId"] = groupId;

            await Task.WhenAll(
                Groups.AddToGroupAsync(Context.ConnectionId, groupId),
                Groups.AddToGroupAsync(Context.ConnectionId, isOrganizer ? $"{groupId}-organizer" : $"{groupId}-players")
            );

            if (isOrganizer)
            {
                if (!isRunning) await Clients.Group(groupId).SendAsync("reset");
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
            var isNameChange = statusMessage
                .Message
                .EnumerateObject()
                .Any(prop => prop.Name == "name" && prop.Value.ValueKind == JsonValueKind.String);

            if (isNameChange)
            {
                var newName = statusMessage.Message.GetProperty("name").GetString();
                if (newName.Length > Domain.Constants.MaxUsernameChars)
                {
                    throw new HubException($"Name must be {Domain.Constants.MaxUsernameChars} characters or less.");
                }
                Context.Items["name"] = newName;
            }

            await (isNameChange
                ? Clients.Group(statusMessage.GroupId)
                : Clients.OthersInGroup(statusMessage.GroupId)).SendAsync("status", statusMessage.Message);
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
        public async Task SendChat(GroupMessage chatMessage)
        {
            await Clients.Group(chatMessage.GroupId).SendAsync("addToChat", chatMessage.Message);
        }

        [Transaction(Web = true)]
        public async Task SetChatLines(GroupMessage chatMessage)
        {
            await Clients.OthersInGroup(chatMessage.GroupId).SendAsync("setChatLines", chatMessage.Message);
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

            if (!isOrganizer)
            {
                await Clients.Group(groupId).SendAsync("addToChat", new
                {
                    notification = $"[{Context.Items["name"] ?? "[Un-named player]"} disconnected]"
                });
            }

            if (exception != null) logger.LogError(exception, "Disconnected");
        }
    }
}