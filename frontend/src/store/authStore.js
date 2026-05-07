import { create } from "zustand";
import apiClient from "@/lib/apiClient";

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  // Initialize from localStorage
  init: () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      if (token && user) {
        set({ token, user: JSON.parse(user) });
      }
    }
  },

  // Register
  register: async (email, password, firstName, lastName) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await apiClient.post("/auth/register", {
        email,
        password,
        firstName,
        lastName,
      });

      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data));

      set({
        user: data.data,
        token: data.data.token,
        isLoading: false,
      });

      return data.data;
    } catch (error) {
      const message = error.response?.data?.error || "Registration failed";
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  // Login
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await apiClient.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data));

      set({
        user: data.data,
        token: data.data.token,
        isLoading: false,
      });

      return data.data;
    } catch (error) {
      const message = error.response?.data?.error || "Login failed";
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null });
  },

  // Get profile
  getProfile: async () => {
    set({ isLoading: true });
    try {
      const { data } = await apiClient.get("/auth/profile");
      set({ user: data.data, isLoading: false });
      localStorage.setItem("user", JSON.stringify(data.data));
      return data.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useAuthStore;
