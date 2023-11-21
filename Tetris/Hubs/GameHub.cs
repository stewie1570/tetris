using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using NewRelic.Api.Agent;
using Sentry;
using Tetris.Domain.Interfaces;
using Tetris.Domain.Models;

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
        private readonly IGameRoomRepo gameRoomRepo;

        public GameHub(ILogger<GameHub> logger, IGameRoomRepo gameRoomRepo)
        {
            this.logger = logger;
            this.gameRoomRepo = gameRoomRepo;
        }

        [Transaction(Web = true)]
        public async Task Hello(GroupMessage helloMessage)
        {
            string groupId = helloMessage.GroupId;
            string userId = helloMessage.Message.GetProperty("userId").GetString();
            bool isRunning = helloMessage.Message.GetProperty("isRunning").GetBoolean();
            helloMessage.Message.TryGetProperty("name", out var name);
            var isOrganizer = userId == groupId;
            Context.Items["userId"] = userId;
            Context.Items["groupId"] = groupId;
            Context.Items["name"] = name;

            await Task.WhenAll(
                Groups.AddToGroupAsync(Context.ConnectionId, groupId),
                Groups.AddToGroupAsync(Context.ConnectionId, isOrganizer ? $"{groupId}-organizer" : $"{groupId}-players")
            );

            if (isOrganizer)
            {
                if (!isRunning) await Clients.Group(groupId).SendAsync("reset");
                await gameRoomRepo.AddGameRoom(new GameRoom
                {
                    OrganizerId = groupId,
                    Status = GameRoomStatus.Waiting,
                    Players = new Dictionary<string, UserScore>
                    {
                        { groupId, new UserScore { } }
                    }
                });
            }
            else
            {
                await Clients.Group($"{groupId}-organizer").SendAsync("hello", helloMessage.Message);
                var patch = new JsonPatchDocument<GameRoom>();
                patch.Add(room => room.Players[userId], new UserScore { });
                await gameRoomRepo.UpdateGameRoom(patch, groupId);
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

                var patch = new JsonPatchDocument<GameRoom>();
                patch.Replace(
                    room => room.Players[Context.Items["userId"] as string],
                    new UserScore { Username = newName });
                await gameRoomRepo.UpdateGameRoom(patch, Context.Items["groupId"] as string);
            }

            await (isNameChange
                ? Clients.Group(statusMessage.GroupId)
                : Clients.OthersInGroup(statusMessage.GroupId)).SendAsync("status", statusMessage.Message);
        }

        [Transaction(Web = true)]
        public async Task Start(GroupMessage statusMessage)
        {
            await Clients.Group(statusMessage.GroupId).SendAsync("start");

            var patch = new JsonPatchDocument<GameRoom>();
            patch.Replace(room => room.Status, GameRoomStatus.Running);
            await gameRoomRepo.UpdateGameRoom(patch, Context.Items["groupId"] as string);
        }

        [Transaction(Web = true)]
        public async Task Results(GroupMessage resultsMessage)
        {
            await Clients.Group(resultsMessage.GroupId).SendAsync("results", resultsMessage.Message);

            var patch = new JsonPatchDocument<GameRoom>();
            patch.Replace(room => room.Status, GameRoomStatus.Waiting);
            await gameRoomRepo.UpdateGameRoom(patch, Context.Items["groupId"] as string);
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
                var patch = new JsonPatchDocument<GameRoom>();
                patch.Remove(room => room.Players[userId]);
                await gameRoomRepo.UpdateGameRoom(patch, Context.Items["groupId"] as string);
            }
            else
            {
                await gameRoomRepo.RemoveGameRoom(new GameRoom { OrganizerId = groupId });
            }

            if (exception != null) logger.LogError(exception, "Disconnected");
        }
    }
}