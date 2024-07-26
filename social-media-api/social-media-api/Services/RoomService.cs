using social_media_api.DTOS;
using social_media_api.Models;
using static Microsoft.Extensions.Logging.EventSource.LoggingEventSource;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Configuration;
using System;

namespace social_media_api.Services
{
    public class RoomService : IRoomService
    {
        private readonly IConfiguration configuration;
        private readonly ChatAppDemoContext db;

        public RoomService(IConfiguration configuration, ChatAppDemoContext db)
        {
            this.configuration = configuration;
            this.db = db;
        }

        public string CreateRoom(string roomId)
        {

            Room room = new Room();

            var roomExist = db.Rooms.Any(z => z.RoomId.Equals(roomId));
            if (roomExist)
            {

                return "Room Already Exist";

            }
            else
            {

                room.RoomId = roomId;
                //Type: Chat
                room.RoomTypeId = 1;
                room.IsActive = true;
                room.DateTimeCreated = DateTime.Now;
                db.Rooms.Add(room);
                db.SaveChanges();

            }

            return "Successfully Created Account";

        }

        public string GetRoomIdByRoomType(long roomTypeId)
        {

            var query = db.Rooms.Where(z => z.RoomTypeId != roomTypeId);

            if(query.Count() > 0 )
            {
                return query.Select(z => z.RoomId).ToString();
            }
            else
            {

                return "no room data in the table";

            }

        }


    }
}
