using System;

namespace social_media_api.Library
{
    public static class Commons
    {

        public static string GetFormattedExceptionMessage(Exception ex)
        {
            string exm = "";
            if (ex.Message != null && ex.Message.Trim().Length > 0)
                exm += string.Format("Message: {0}", ex.Message);

            if (ex.InnerException != null && ex.InnerException.Message != null && ex.InnerException.Message.Trim().Length > 0)
            {
                exm += string.Format(";Inner Exception Message: {0}", ex.InnerException.Message);
            }

            if (ex.InnerException != null && ex.InnerException.Message != null && ex.InnerException.Message.Trim().Length > 0 &&
                ex.InnerException.InnerException != null && ex.InnerException.InnerException.Message != null && ex.InnerException.InnerException.Message.Trim().Length > 0)
            {
                exm += string.Format(";Inner Exception Message: {0}", ex.InnerException.InnerException.Message);
            }

            return exm;
        }

    }
}
