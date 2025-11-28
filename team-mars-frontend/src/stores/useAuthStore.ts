import { create } from 'zustand';

// Define the interface for our auth state
interface AuthState {
  user: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: string | null) => void;
  login: (username: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

// Create the Zustand store
export const useAuthStore = create<AuthState>((set) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isLoading: false,

  // Actions
  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  login: (username) =>
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

  setLoading: (loading) => set({ isLoading: loading }),
}));
