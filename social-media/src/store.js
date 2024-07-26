import create from "zustand";
import axios from "axios";
import * as APIHelpers from "./utils/helpers/APIHelpers";
const useStore = create((set) => ({
  loading: false,
  data: null,
  error: null,
  isClientConnected: false,
  isLogin: false,
  waitingList: null,

  setLoading: (value) => {
    set({
      loading: value,
    });
  },

  setIsClientConnected: (value) => {
    set({
      isClientConnected: value,
    });
  },

  setIsLogin: (value) => {
    set({
      isLogin: value,
    });
  },

  fetchData: async () => {
    set({ loading: true, error: null });
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/posts"
      );
      set({ data: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  getWaitingList: async (keyword, page, pageSize) => {
    try {
      var url = `https://localhost:44321/api/get-waitinglist?keyword=${keyword}&page=${page}&pageSize=${pageSize}`;
      const response = await APIHelpers.GETWAITINGLIST(url);
      set({ waitingList: response.data });
      console.log("waitingList: ", response.data);
    } catch (error) {
      console.log(error);
    }
  },

  updateWaitingList: async (WLMRoomId, IsActive) => {
    try {
      var url = `https://localhost:44321/api/update-waitinglist`;
      const response = await APIHelpers.UPDATEWAITINGLIST(url, {
        WlroomId: WLMRoomId,
        IsActive,
      });

      console.log("updateWaitingList: ", response.data);
    } catch (error) {
      console.log(error);
    }
  },
}));

export default useStore;
