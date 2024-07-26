using System;
using System.Collections.Generic;

#nullable disable

namespace social_media_api.Models
{
    public partial class Room
    {
        public Room()
        {
            UserMessages = new HashSet<UserMessage>();
        }

        public long Id { get; set; }
        public string RoomId { get; set; }
        public long? RoomTypeId { get; set; }
        public bool? IsActive { get; set; }
        public DateTime? DateTimeCreated { get; set; }
        public DateTime? DateTimeUpdated { get; set; }

        public virtual RoomType RoomType { get; set; }
        public virtual ICollection<UserMessage> UserMessages { get; set; }
    }
}
