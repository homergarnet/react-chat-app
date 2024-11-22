// useScreenSize.js
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthContext from "store/auth/useAuthContext";
import { jwtDecode } from "jwt-decode";
const useRedirect = () => {
  const { regexBlackListedChars, getLoginStatus, loginStatus, jwtToken } =
    useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (jwtToken) {
      try {
        const decodedToken = jwtDecode(jwtToken);
        const isTokenExpired = decodedToken.exp * 1000 < Date.now();
        if (!isTokenExpired) {
          const redirectUrl = location?.state?.prevUrl || "/chat";
          navigate(redirectUrl);
        }
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }
  }, [jwtToken, navigate, location]);
};

export default useRedirect;
