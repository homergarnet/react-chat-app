﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace social_media_api.Hubs
{
    public class ChatHub : Hub
    {

        // A thread-safe dictionary to keep track of active rooms and their members
        private static readonly ConcurrentDictionary<string, HashSet<string>> ActiveRooms = new ConcurrentDictionary<string, HashSet<string>>();

        // When a user accesses the chat and opens a new tab, this will run
        public async Task InitializeRoom(string roomId)
        {
            string connectionId = Context.ConnectionId;
            // Add the connectionId to the room
            ActiveRooms.AddOrUpdate(
                roomId,
            new HashSet<string> { connectionId },
                (key, existingSet) => { existingSet.Add(connectionId); return existingSet; }
            );
            await Groups.AddToGroupAsync(connectionId, roomId);
            await Clients.Group(roomId).SendAsync("RoomInitialized", roomId);
        }

        // When a user sends a message, this will run
        public async Task SendMessage(string roomId, string user, string message)
        {
            string connectionId = Context.ConnectionId;
            // Broadcast message to all clients in the specified room
            await Clients.Group(roomId).SendAsync("ReceiveMessage", user, message);
        }

        // When a user accesses the chat and reloads the tab, this will run
        public override async Task OnConnectedAsync()
        {
            string connectionId = Context.ConnectionId;
            // Example: Join a default room when the user connects
            await Groups.AddToGroupAsync(connectionId, "chatRoom");
            await base.OnConnectedAsync();
        }

        // This method will run when a user closes a tab or reloads the tab
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            string connectionId = Context.ConnectionId;
            foreach (var room in ActiveRooms)
            {
                if (room.Value.Contains(connectionId))
                {
                    room.Value.Remove(connectionId);
                    if (room.Value.Count == 0)
                    {
                        // Remove the room from the dictionary if no members are left
                        //add backend
                        ActiveRooms.TryRemove(room.Key, out _);
                    }
                }
            }
            await base.OnDisconnectedAsync(exception);
        }

        // Method to check if a room is still active
        public bool IsRoomActive(string roomId)
        {
            return ActiveRooms.ContainsKey(roomId);
        }
    }
}
