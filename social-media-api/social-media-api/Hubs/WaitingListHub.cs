using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using Microsoft.Extensions.Configuration;
using social_media_api.Services;
using social_media_api.DTOS;

namespace social_media_api.Hubs
{
    public class WaitingListHub : Hub
    {

        private readonly IConfiguration _configuration;
        private readonly IWaitingListService _iWaitingListService;

        public WaitingListHub(IWaitingListService iWaitingListService, IConfiguration configuration)
        {
            _iWaitingListService = iWaitingListService;
            _configuration = configuration;
        }

        // A thread-safe dictionary to keep track of active rooms and their members
        private static readonly ConcurrentDictionary<string, HashSet<string>> ActiveRooms = new ConcurrentDictionary<string, HashSet<string>>();

        // When a user accesses the chat and opens a new tab, this will run
        public async Task InitializeWaitingListRoom(string roomId)
        {
            string connectionId = Context.ConnectionId;
            // Add the connectionId to the room
            ActiveRooms.AddOrUpdate(
                roomId,
            new HashSet<string> { connectionId },
                (key, existingSet) => { existingSet.Add(connectionId); return existingSet; }
            );
            await Groups.AddToGroupAsync(connectionId, roomId);
            await Clients.Group(roomId).SendAsync("WaitingListRoomInitialized", roomId);
        }

        // When a user send waiting the csr, this will run
        public async Task SendWaitingListMessage(string roomId, string customerName, string concern, string RWLMRoomId)
        {

            string connectionId = Context.ConnectionId;

            WaitingListDTO waitingListDTO = new WaitingListDTO();
            waitingListDTO.CustomerName = customerName;
            waitingListDTO.Concern = concern;
            waitingListDTO.WlroomId = RWLMRoomId;
            _iWaitingListService.CreateWaitingList(waitingListDTO);
            // Broadcast message to all clients in the specified room
            await Clients.Group(roomId).SendAsync("ReceiveWaitingListMessage", customerName, concern, RWLMRoomId);

        }

        // When a csr accepts the client, this will run
        public async Task AcceptWaitingMessage(string roomId, string customerName, string concern, string RWLMRoomId)
        {
            string connectionId = Context.ConnectionId;
            WaitingListDTO waitingListDTO = new WaitingListDTO();
            waitingListDTO.IsActive = false;
            _iWaitingListService.UpdateWaitingListActiveStatus(waitingListDTO);
            // Broadcast message to all clients in the specified room
            await Clients.Group(roomId).SendAsync("ReceivedAcceptWaitingMessage", customerName, concern, RWLMRoomId);
        }

        // When a user accesses the chat and reloads the tab, this will run
        public override async Task OnConnectedAsync()
        {
            string connectionId = Context.ConnectionId;
            // Example: Join a default room when the user connects
            await Groups.AddToGroupAsync(connectionId, "waitingListRoom");
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
