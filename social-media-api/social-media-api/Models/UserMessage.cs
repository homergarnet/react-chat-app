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

        public virtual User User { get; set; }
    }
}
