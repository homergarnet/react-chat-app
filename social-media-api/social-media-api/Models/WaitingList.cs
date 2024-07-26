using System;
using System.Collections.Generic;

#nullable disable

namespace social_media_api.Models
{
    public partial class WaitingList
    {
        public long WaitingListId { get; set; }
        public string CustomerName { get; set; }
        public string Concern { get; set; }
        public string WlroomId { get; set; }
        public bool? IsActive { get; set; }
    }
}
