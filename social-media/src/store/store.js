// src/store.js
import create from "zustand";
import axios from "axios";

const useStore = create((set) => ({
  loading: false,
  data: null,
  error: null,
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
}));

export default useStore;
