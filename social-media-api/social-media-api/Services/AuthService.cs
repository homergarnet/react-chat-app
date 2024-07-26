using Microsoft.Extensions.Configuration;
using social_media_api.DTOS;
using social_media_api.Models;
using System.Linq;
using System;
using Microsoft.IdentityModel.Tokens;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace social_media_api.Services
{
    public class AuthService : IAuthService
    {

        private readonly IConfiguration configuration;
        private readonly ChatAppDemoContext db;

        public AuthService(IConfiguration configuration, ChatAppDemoContext db)
        {
            this.configuration = configuration;
            this.db = db;
        }

        public string CreateAccount(UserDTO userReq)
        {
            User user = new User();

            var userExist = db.Users.Any(z => z.Username == userReq.Username);
            if (userExist)
            {
                return "User Already Exist";
            }
            else
            {

                user.Username = userReq.Username;
                user.Password = BCrypt.Net.BCrypt.HashPassword(userReq.Password);


                db.Users.Add(user);
                db.SaveChanges();
            }
            return "Successfully Created Account";
        }

        public string Login(UserDTO userReq)
        {
            var user = db.Users.Where(z => z.Username == userReq.Username).FirstOrDefault();
            bool verified = false;
            string password = userReq.Password.Trim();

            if (user != null)
            {
                verified = BCrypt.Net.BCrypt.Verify(password, user.Password);
                if (verified)
                {

                    // User Claims
                    var claims = new List<Claim>
                    {
                        new Claim("UserId", user.Id.ToString()),
                        new Claim("Username", user.Username.ToString()),
                      

                    };

                    // Encrypt credentials
                    var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]));
                    var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

                    var auth = new JwtSecurityToken(configuration["Jwt:Issuer"],
                        configuration["Jwt:Issuer"],
                        claims,
                        expires: DateTime.Now.AddHours(1), // Set to 1 year
                        signingCredentials: credentials);

                    // Generate JWT
                    var token = new JwtSecurityTokenHandler().WriteToken(auth);

                    return token;
                  
                }

                //Not verified
                else
                {
                    return "Wrong User or Password";
                }

            }

            return "Wrong User or Password";
        }
    }
}
