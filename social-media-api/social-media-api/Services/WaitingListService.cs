using Microsoft.Extensions.Configuration;
using social_media_api.DTOS;
using social_media_api.Models;
using System.Linq;
using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace social_media_api.Services
{
    public class WaitingListService : IWaitingListService
    {
        private readonly IConfiguration configuration;
        private readonly ChatAppDemoContext db;

        public WaitingListService(IConfiguration configuration, ChatAppDemoContext db)
        {
            this.configuration = configuration;
            this.db = db;
        }

        public string CreateWaitingList(WaitingListDTO waitingListReq)
        {
            WaitingList waitingList = new WaitingList();

            var waitingListExist = db.WaitingLists.Any(z => z.WaitingListId.Equals(waitingListReq.WaitingListId));
            if (waitingListExist)
            {

                return "WaitingLists Already Exist";

            }
            else
            {

                waitingList.CustomerName = waitingListReq.CustomerName;
                //Type: Chat
                waitingList.Concern = waitingListReq.Concern;
                waitingList.WlroomId = waitingListReq.WlroomId;
                waitingList.IsActive =true;
                db.WaitingLists.Add(waitingList);
                db.SaveChanges();

            }

            return "Successfully Created Waiting List";
        }

        public List<WaitingListDTO> GetWaitingList(string keyword, int page, int pageSize)
        {
            IQueryable<WaitingList> query = db.WaitingLists.Where(z => z.IsActive == true);



            List<WaitingListDTO> getWaitingList = new List<WaitingListDTO>();
            if (!string.IsNullOrEmpty(keyword))
            {
                query = query.Where(
                    z => z.CustomerName.Contains(keyword) || z.Concern.Contains(keyword) ||
                    z.WlroomId.Contains(keyword) 
                );
            }

            var waitingListRes = query

            .Skip((page - 1) * pageSize).Take(pageSize).ToList();

            foreach (var waitingList in waitingListRes)
            {

                var waitingListDto = new WaitingListDTO();
                waitingListDto.WaitingListId = waitingList.WaitingListId;
                waitingListDto.CustomerName = waitingList.CustomerName;
                waitingListDto.Concern = waitingList.Concern;
                waitingListDto.WlroomId = waitingList.WlroomId;
                waitingListDto.IsActive = true;
                getWaitingList.Add(waitingListDto);

            }

            return getWaitingList;
        }

        public string UpdateWaitingListActiveStatus(WaitingListDTO waitingListReq)
        {
            var hasWaitingList = db.WaitingLists.Any(z => z.WlroomId == waitingListReq.WlroomId);
            if (hasWaitingList)
            {

                var waitingList = db.WaitingLists.Where(z => z.WlroomId == waitingListReq.WlroomId).First();
                waitingList.IsActive = waitingListReq.IsActive;
                db.SaveChanges();

            }


            return "Update Successfully Waiting List Active Status";

        }
    }
}
