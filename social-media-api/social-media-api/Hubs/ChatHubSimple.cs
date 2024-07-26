using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System;
using Microsoft.AspNetCore.SignalR;

namespace social_media_api.Hubs
{
    public class ChatHubSimple : Hub
    {

        //When user access the chat, open a new tab, this will run
        public async Task InitializeRoom(string roomId)
        {

            string connectionId = Context.ConnectionId;
            // Store room information or initialize room-specific state
            // You can store this information in-memory, in a database, or another persistent storage based on your needs
            // Example: Store room state in a dictionary or in-memory cache
            await Clients.Group(roomId).SendAsync("RoomInitialized", roomId);
        }

        //When user send a message this will run
        public async Task SendMessage(string roomId, string user, string message)
        {
            string connectionId = Context.ConnectionId;
            // Broadcast message to all clients in the specified room
            await Clients.Group(roomId).SendAsync("ReceiveMessage", user, message);
        }

        //When user access the chat, reload the tab this will run
        public override async Task OnConnectedAsync()
        {
            string connectionId = Context.ConnectionId;
            // Example: Join a default room when user connects
            await Groups.AddToGroupAsync(Context.ConnectionId, "chatRoom");
            await base.OnConnectedAsync();
        }

        //This method will run when user close a tab, reload the tab

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            string connectionId = Context.ConnectionId;
            // Clean up (leave rooms, etc.) when user disconnects
            await base.OnDisconnectedAsync(exception);
        }
    }
}
