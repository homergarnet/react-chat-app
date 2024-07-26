using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using social_media_api.Services;
using static Azure.Core.HttpHeader;
using System;
using social_media_api.Library;
using System.Text.Json;
using social_media_api.DTOS;
using Microsoft.AspNetCore.Authorization;

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

        [Authorize]
        [HttpGet]
        [Route("api/get-waitinglistbycsr")]
        public IActionResult GetWaitingListByCsrId(
            [FromQuery] string keyword, [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10
        )
        {

            try
            {
                var userId = Convert.ToInt64(User.FindFirst("UserId").Value);
                var getWaitingList = _iWaitingListService.GetWaitingListByCsrId(keyword, page, pageSize, userId);

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

        [Authorize]
        [HttpPut]
        [Route("api/update-waitinglist")]
        public IActionResult UpdateWaitingList(

            [FromBody] WaitingListDTO waitingListReq
        )
        {

            try
            {
                var userId = Convert.ToInt64(User.FindFirst("UserId").Value);
                waitingListReq.AccomodatedBy = userId;
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
