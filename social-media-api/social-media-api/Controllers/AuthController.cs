using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using social_media_api.DTOS;
using social_media_api.Services;
using static Azure.Core.HttpHeader;
using System;
using social_media_api.Library;


namespace social_media_api.Controllers
{
    public class AuthController : ControllerBase
    {

        private readonly IConfiguration _configuration;
        private readonly IAuthService _iAuthService;

        public AuthController(IAuthService iAuthService, IConfiguration configuration)
        {
            _iAuthService = iAuthService;
            _configuration = configuration;
        }

        [HttpPost]
        [Route("api/create-account")]
        public IActionResult CreateAccount([FromBody] UserDTO userInfo)
        {
            try
            {

                var user = _iAuthService.CreateAccount(userInfo);
                if (user == "User Already Exist")
                {
                    return new ContentResult
                    {
                        StatusCode = 500,
                        ContentType = "application/json",
                        Content = user
                    };
                }
                return new ContentResult
                {
                    StatusCode = 200,
                    ContentType = "application/json",
                    Content = user
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

        [HttpPost]
        [Route("api/login")]
        public IActionResult Login([FromBody] UserDTO loginInfo)
        {
            try
            {

                var loginRes = _iAuthService.Login(loginInfo);
                if (loginRes.Equals("Wrong User or Password"))
                {
                    return new ContentResult
                    {
                        StatusCode = 500,
                        ContentType = "application/json",
                        Content = loginRes
                    };
                }
                return new ContentResult
                {
                    StatusCode = 200,
                    ContentType = "application/json",
                    Content = loginRes
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
