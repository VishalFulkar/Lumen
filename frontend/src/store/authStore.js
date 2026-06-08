import { create } from "zustand";
import { authAPI } from "../services/api";

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isCheckingAuth: true,
    error: null,

    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),

    checkAuth: async () => {
        set({ isCheckingAuth: true, error: null });
        try {
            const { data } = await authAPI.getMe();
            if (data && data.user) {
                set({
                    user: data.user,
                    isAuthenticated: true,
                    isCheckingAuth: false
                });
            } else {
                set({
                    user: null,
                    isAuthenticated: false,
                    isCheckingAuth: false
                });
            }
        } catch (error) {
            set({
                user: null,
                isAuthenticated: false,
                isCheckingAuth: false
            });
        }
    },

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await authAPI.login(email, password);
            set({
                user: data.user,
                isAuthenticated: true,
                isLoading: false,
                error: null
            });
            return data;
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Login failed. Please check your credentials.";
            set({
                error: errorMsg,
                isLoading: false,
                isAuthenticated: false
            });
            throw error;
        }
    },

    register: async (email, password, name) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await authAPI.register(email, password, name);
            set({
                user: data.user,
                isAuthenticated: true,
                isLoading: false,
                error: null
            });
            return data;
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Registration failed. Please try again.";
            set({
                error: errorMsg,
                isLoading: false,
                isAuthenticated: false
            });
            throw error;
        }
    },

    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await authAPI.logout();
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null
            });
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Logout failed.";
            set({
                error: errorMsg,
                isLoading: false
            });
            throw error;
        }
    }
}));
