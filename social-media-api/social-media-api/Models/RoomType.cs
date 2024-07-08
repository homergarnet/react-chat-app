using System;
using System.Collections.Generic;

#nullable disable

namespace social_media_api.Models
{
    public partial class RoomType
    {
        public RoomType()
        {
            Rooms = new HashSet<Room>();
        }

        public long Id { get; set; }
        public string Type { get; set; }
        public string Name { get; set; }

        public virtual ICollection<Room> Rooms { get; set; }
    }
}
