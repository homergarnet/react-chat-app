using System;
using System.Collections.Generic;

#nullable disable

namespace social_media_api.Models
{
    public partial class User
    {
        public User()
        {
            WaitingLists = new HashSet<WaitingList>();
        }

        public long Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public bool? IsAvailable { get; set; }

        public virtual ICollection<WaitingList> WaitingLists { get; set; }
    }
}
