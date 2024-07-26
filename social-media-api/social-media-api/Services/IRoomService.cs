using social_media_api.DTOS;
using System.Collections.Generic;

namespace social_media_api.Services
{
    public interface IRoomService
    {

        string CreateRoom(string roomId);
        string GetRoomIdByRoomType(long roomTypeId);

    }
}
