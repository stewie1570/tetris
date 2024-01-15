using System;
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
using Tetris.Core;

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
                var resetting = isRunning ? Task.FromResult(0) : Clients.Group(groupId).SendAsync("reset");
                var addingGameRoom = gameRoomRepo.AddGameRoom(new GameRoom
                {
                    OrganizerId = groupId,
                    Status = GameRoomStatus.Waiting,
                    Players = new Dictionary<string, UserScore>
                    {
                        { groupId, new UserScore { } }
                    }
                });

                await resetting;
                await addingGameRoom;
            }
            else
            {
                await Clients.Group($"{groupId}-organizer").SendAsync("addToChat", new
                {
                    notification = "connected",
                    userId
                });
                await Clients.Group($"{groupId}-organizer").SendAsync("hello", helloMessage.Message);
            }
        }

        [Transaction(Web = true)]
        public async Task PlayersListUpdate(GroupMessage playersListUpdateMessage)
        {
            var sendingBroadcast = Clients
                .Group($"{playersListUpdateMessage.GroupId}-players")
                .SendAsync("playersListUpdate", playersListUpdateMessage.Message);

            var playersList = playersListUpdateMessage.Message.To<PlayersList>();
            var patch = new JsonPatchDocument<GameRoom>();
            patch.Replace(room => room.Players, playersList
                .Players
                .ToDictionary(keySelector: player => player.UserId, elementSelector: player => new UserScore
                {
                    Username = player.Name
                }));
            var updatingRoom = gameRoomRepo.TryUpdateGameRoom(patch, Context.Items["groupId"] as string);

            await sendingBroadcast;
            await updatingRoom;
        }

        [Transaction(Web = true)]
        public async Task Status(GroupMessage statusMessage)
        {
            var isNameChange = statusMessage
                .Message
                .EnumerateObject()
                .Any(prop => prop.Name == "name" && prop.Value.ValueKind == JsonValueKind.String);

            Func<Task> doNameChange = () =>
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
                return gameRoomRepo.TryUpdateGameRoom(patch, Context.Items["groupId"] as string);
            };

            await Task.WhenAll(
                isNameChange ? doNameChange() : Task.FromResult(0),
                (isNameChange
                    ? Clients.Group(statusMessage.GroupId)
                    : Clients.OthersInGroup(statusMessage.GroupId)).SendAsync("status", statusMessage.Message)
            );
        }

        [Transaction(Web = true)]
        public async Task Start(GroupMessage statusMessage)
        {
            var doingBroadcast = Clients.Group(statusMessage.GroupId).SendAsync("start");

            var patch = new JsonPatchDocument<GameRoom>();
            patch.Replace(room => room.Status, GameRoomStatus.Running);
            var updatingRoom = gameRoomRepo.TryUpdateGameRoom(patch, Context.Items["groupId"] as string);

            await doingBroadcast;
            await updatingRoom;
        }

        [Transaction(Web = true)]
        public async Task Results(GroupMessage resultsMessage)
        {
            var doingBroadcast = Clients.Group(resultsMessage.GroupId).SendAsync("results", resultsMessage.Message);

            var patch = new JsonPatchDocument<GameRoom>();
            patch.Replace(room => room.Status, GameRoomStatus.Waiting);
            var updatingRoom = gameRoomRepo.TryUpdateGameRoom(patch, Context.Items["groupId"] as string);

            await doingBroadcast;
            await updatingRoom;
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
                : Clients.Group(groupId).SendAsync("status", new { userId, disconnected = true }));

            if (!isOrganizer)
            {
                string name = Context.Items["name"].ToString();
                var doingBroadcast = Clients.Group(groupId).SendAsync("addToChat", new
                {
                    notification = "disconnected",
                    userId
                });
                var patch = new JsonPatchDocument<GameRoom>();
                patch.Remove(room => room.Players[userId]);
                var updatingRoom = gameRoomRepo.TryUpdateGameRoom(patch, Context.Items["groupId"] as string);

                await doingBroadcast;
                await updatingRoom;
            }
            else
            {
                await gameRoomRepo.RemoveGameRoom(new GameRoom { OrganizerId = groupId });
            }

            if (exception != null) logger.LogError(exception, "Disconnected");
        }
    }
}