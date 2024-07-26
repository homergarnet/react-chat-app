using social_media_api.DTOS;

namespace social_media_api.Services
{
    public interface IAuthService
    {

        string CreateAccount(UserDTO userReq);
        string Login(UserDTO userReq);

    }
}
