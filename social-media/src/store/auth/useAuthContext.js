import { create } from "zustand";
import * as APIHelpers from "../../utils/helpers/APIHelpers";
export const useAuthContext = create((set, get) => ({
  username: "",
  password: "",
  authLoading: false,

  regexBlackListedChars: /[~<>\\'"`]/,

  setUsername: (username) => set({ username }),
  setPassword: (password) => set({ password }),
  setAuthLoading: (value) => {
    set({
      authLoading: value,
    });
  },

  getLoginStatus: async (username, password, antiForgeryToken) => {
    try {
      var url = "https://localhost:44321/api/login";
      set({ authLoading: true });
      const response = await APIHelpers.LOGINREQUEST(url, {
        Username: username,
        Password: password,
      });
      console.log("response: ", response);
      if (response.data !== "Wrong User or Password") {
        localStorage.setItem("authToken", response.data);
        set({ authLoading: false });
        return "login success";
      }
      set({ authLoading: false });
      return "Wrong User or Password";
    } catch (error) {
      console.log(error);
      set({ authLoading: false });
      return "Wrong User or Password";
    }
  },
}));

export default useAuthContext;
