import {create} from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null; // Added token state
  theme: 'light' | 'dark' | 'system';
  setUser: (user: User | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setToken: (token: string | null) => void; // Added setToken action
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  logout: () => void; // Added logout action
  // Add other global states and actions here
}

const useStore = create<AppState>((set) => ({
  user: null,
  isAuthenticated: false,
  token: null, // Initialize token
  theme: 'system', // Default theme
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setToken: (token) => set({ token, isAuthenticated: !!token }), // Update isAuthenticated when token changes
  setTheme: (theme) => set({ theme }),
  logout: () => set({ user: null, isAuthenticated: false, token: null }), // Clear user, auth status, and token
}));

export default useStore;
