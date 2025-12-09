import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setUser: (user: string | null) => void;
  login: (username: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user: string | null) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      login: (username: string) =>
        set({
          user: username,
          isAuthenticated: true,
          isLoading: false,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage', // key inside localStorage
    },
  ),
);
