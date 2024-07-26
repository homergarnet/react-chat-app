using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using social_media_api.Services;
using static Azure.Core.HttpHeader;
using System;
using social_media_api.Library;
using System.Text.Json;
using social_media_api.DTOS;

namespace social_media_api.Controllers
{
    public class WaitingListController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IWaitingListService _iWaitingListService;

        public WaitingListController(IConfiguration configuration, IWaitingListService iWaitingListService)
        {
            _configuration = configuration;
            _iWaitingListService = iWaitingListService;
        }

        [HttpGet]
        [Route("api/get-waitinglist")]
        public IActionResult GetWaitingList(
            [FromQuery] string keyword, [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10
        )
        {

            try
            {

                var getWaitingList = _iWaitingListService.GetWaitingList(keyword, page, pageSize);

                return new ContentResult
                {
                    StatusCode = 200,
                    ContentType = "application/json",
                    Content = JsonSerializer.Serialize(getWaitingList)
                };

            }

            catch (Exception ex)
            {
                return new ContentResult
                {
                    StatusCode = 500,
                    ContentType = "text/html",
                    Content = Commons.GetFormattedExceptionMessage(ex)
                };
            }

        }

        [HttpPut]
        [Route("api/update-waitinglist")]
        public IActionResult UpdateWaitingList(

            [FromBody] WaitingListDTO waitingListReq
        )
        {

            try
            {

                var updateWaitingList = _iWaitingListService.UpdateWaitingListActiveStatus(waitingListReq);

                return new ContentResult
                {
                    StatusCode = 200,
                    ContentType = "application/json",
                    Content = JsonSerializer.Serialize(updateWaitingList)
                };

            }

            catch (Exception ex)
            {
                return new ContentResult
                {
                    StatusCode = 500,
                    ContentType = "text/html",
                    Content = Commons.GetFormattedExceptionMessage(ex)
                };
            }

        }

    }
}
