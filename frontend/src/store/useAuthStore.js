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
  isGreetingFinished: false,
  isOnboarded: false, // Thêm state quản lý onboarding
  isLoading: true,

  finishGreeting: () => set({ isGreetingFinished: true }),
  
  completeOnboarding: async () => {
    try {
      // Gọi API cập nhật trạng thái lên server (Sửa PATCH -> PUT vì server dùng PUT)
      await apiClient.put('/users/profile', { hasCompletedOnboarding: true });
      await safeStorage.setItem('hasCompletedOnboarding', 'true');
      set({ isOnboarded: true });
    } catch (error) {
      console.error('Failed to sync onboarding status:', error);
      // Vẫn set tốn tại local để user có thể tiếp tục
      set({ isOnboarded: true });
    }
  },

  init: async () => {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    try {
      const [token, userStr] = await Promise.all([
        safeStorage.getItem('userToken'),
        safeStorage.getItem('userData'),
        delay(2500)
      ]);

      if (token && userStr) {
        const user = JSON.parse(userStr);
        set({
          token,
          user,
          isAuthenticated: true,
          isGreetingFinished: true,
          isOnboarded: user.hasCompletedOnboarding === true
        });
      }
    } catch (error) {
      console.log('Auth check error:', error);
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

      const userData = {
        ...user,
        hasCompletedOnboarding: !!user.hasCompletedOnboarding
      };

      await safeStorage.setItem('userToken', token);
      await safeStorage.setItem('userData', JSON.stringify(userData));

      set({ 
        user: userData,
        token, 
        isAuthenticated: true, 
        isGreetingFinished: false,
        isOnboarded: userData.hasCompletedOnboarding
      });
      return { success: true };
    } catch (error) {
      if (!error.response) {
        return { success: false, message: 'Cannot connect to Server. Is the Backend running?' };
      }
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, message };
    }
  },

  register: async (name, email, password) => {
    try {
      // Đăng ký xong không tự động login nữa
      await apiClient.post('/users/register', { name, email, password });
      return { success: true };
    } catch (error) {
      if (!error.response) {
        return { success: false, message: 'Cannot connect to Server. Is the Backend running?' };
      }
      const message = error.response?.data?.message || 'Registration failed';
      return { success: false, message };
    }
  },

  logout: async () => {
    await safeStorage.removeItem('userToken');
    await safeStorage.removeItem('userData');
    await safeStorage.removeItem('hasCompletedOnboarding');
    set({ user: null, token: null, isAuthenticated: false, isOnboarded: false, isGreetingFinished: false });
  },
}));

export default useAuthStore;
