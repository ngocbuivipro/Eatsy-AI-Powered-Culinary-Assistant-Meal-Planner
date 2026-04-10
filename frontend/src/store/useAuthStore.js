import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../api/client';

// Simple memory fallback for testing if AsyncStorage fails (due to RN 0.81 compatibility)
const memoryStorage = {};
const safeStorage = {
  getItem: async (key) => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (e) {
      return memoryStorage[key] || null;
    }
  },
  setItem: async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      memoryStorage[key] = value;
    }
  },
  removeItem: async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      delete memoryStorage[key];
    }
  }
};

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  init: async () => {
    try {
      const token = await safeStorage.getItem('userToken');
      const userStr = await safeStorage.getItem('userData');
      
      if (token && userStr) {
        set({ 
          token, 
          user: JSON.parse(userStr), 
          isAuthenticated: true 
        });
      }
    } catch (error) {
      console.log('Auth check skipped (normal for first time)');
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    try {
      const response = await apiClient.post('/users/login', { email, password });
      const { user, token } = response.data.data;

      await safeStorage.setItem('userToken', token);
      await safeStorage.setItem('userData', JSON.stringify(user));

      set({ user, token, isAuthenticated: true });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, message };
    }
  },

  register: async (name, email, password) => {
    try {
      const response = await apiClient.post('/users', { name, email, password });
      const { user, token } = response.data.data;

      await safeStorage.setItem('userToken', token);
      await safeStorage.setItem('userData', JSON.stringify(user));

      set({ user, token, isAuthenticated: true });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      return { success: false, message };
    }
  },

  logout: async () => {
    await safeStorage.removeItem('userToken');
    await safeStorage.removeItem('userData');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
