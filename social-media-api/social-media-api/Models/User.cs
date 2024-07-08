using System;
using System.Collections.Generic;

#nullable disable

namespace social_media_api.Models
{
    public partial class User
    {
        public User()
        {
            UserMessages = new HashSet<UserMessage>();
        }

        public long Id { get; set; }
        public string Username { get; set; }

        public virtual ICollection<UserMessage> UserMessages { get; set; }
    }
}
