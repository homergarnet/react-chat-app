import { jwtDecode } from "jwt-decode";
import { Navigate, Outlet } from "react-router-dom";

export const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    if (decoded.exp < Date.now() / 1000) {
      // Token is expired
      return true;
    } else {
      // Token is not expired
      return false;
    }
  } catch (error) {
    // If decoding fails, token is considered expired
    return true;
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("authToken");

  if (token && isTokenExpired(token)) {
    // Handle token expiration, e.g., clear local storage and redirect to login
    localStorage.removeItem("authToken");
    // You may navigate to the login page or handle the expired token scenario
  }

  return !!token;
};

// to get the claims of token
export const decodeToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

export const IsAuth = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
};
