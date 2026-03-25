import { create } from 'zustand';
import api from '@/lib/api';

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: any) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isLoading: true,
  error: null,

  login: async (credentials) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await api.post('/auth/login', credentials);
      localStorage.setItem('token', data.token);
      set({ user: data, token: data.token, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Login failed', isLoading: false });
      throw error;
    }
  },

  register: async (userData) => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await api.post('/auth/register', userData);
      localStorage.setItem('token', data.token);
      set({ user: data, token: data.token, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Registration failed', isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  checkAuth: async () => {
    const { token } = get();
    if (!token) {
      set({ isLoading: false });
      return;
    }
    
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data, isLoading: false });
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, token: null, isLoading: false });
    }
  }
}));
