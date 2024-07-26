using social_media_api.DTOS;
using System.Collections.Generic;

namespace social_media_api.Services
{
    public interface IWaitingListService
    {
        string CreateWaitingList(WaitingListDTO waitingListReq);
        List<WaitingListDTO> GetWaitingList(string keyword, int page, int pageSize);
        string UpdateWaitingListActiveStatus(WaitingListDTO waitingListReq);
    }
}
