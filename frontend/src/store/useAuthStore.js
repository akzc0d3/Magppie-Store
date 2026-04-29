import { create } from "zustand";
import { apiRequest } from "@/lib/api";

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  isLoading: false,

  login: async (payload) => {
    set({ isLoading: true });

    try {
      const res = await apiRequest("/v1/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const { accessToken, user } = res.data;

      set({
        user,
        accessToken,
        isLoading: false,
      });

      return true;
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  signup: async (payload) => {
    set({ isLoading: true });

    try {
      await apiRequest("/v1/auth/signup", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      set({ isLoading: false });
      return true;
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  restoreSession: async () => {
    try {
      const res = await apiRequest("/v1/auth/refresh", {
        method: "POST",
      });

      const { accessToken, user } = res.data;

      set({
        user,
        accessToken,
      });
    } catch (err) {
      // silent fail (user not logged in)
      set({
        user: null,
        accessToken: null,
      });
    }
  },

  logout: async () => {
    try {
      await apiRequest("/v1/auth/logout", {
        method: "POST",
      });
    } catch (e) {}

    set({
      user: null,
      accessToken: null,
    });
  },
}));