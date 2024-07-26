using System;
using System.Collections.Generic;

#nullable disable

namespace social_media_api.Models
{
    public partial class UserMessage
    {
        public long Id { get; set; }
        public long? UserId { get; set; }
        public string Message { get; set; }
        public long RoomId { get; set; }
        public bool IsSeen { get; set; }

        public virtual Room Room { get; set; }
    }
}
