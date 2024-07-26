namespace social_media_api.DTOS
{
    public class WaitingListDTO
    {
        public long WaitingListId { get; set; }
        public string CustomerName { get; set; }
        public string Concern { get; set; }
        public string WlroomId { get; set; }
        public bool? IsActive { get; set; }
    }
}
