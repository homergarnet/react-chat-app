using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using social_media_api.Services;

namespace social_media_api.Controllers
{
    public class RoomController : ControllerBase
    {

        private readonly IConfiguration _configuration;
        private readonly IRoomService _iRoomService;

        public RoomController(IRoomService iRoomService, IConfiguration configuration)
        {

            _iRoomService = iRoomService;
            _configuration = configuration;

        }

    }
}
