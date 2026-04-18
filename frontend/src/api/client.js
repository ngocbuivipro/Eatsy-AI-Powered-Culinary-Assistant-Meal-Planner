import axios from 'axios';
import Constants from 'expo-constants';

import { ENDPOINTS } from '../constants/Endpoints';

// Dynamically detect the IP address of the host machine running Expo
const debuggerHost = Constants.expoConfig?.hostUri;
const localhost = debuggerHost?.split(':').shift();

// Base API link
const BASE_URL = localhost 
  ? `http://${localhost}:5050${ENDPOINTS.BASE_URL}` 
  : `http://localhost:5050${ENDPOINTS.BASE_URL}`;

console.log('Connecting to API at:', BASE_URL);

// Import store lazily inside the interceptor to avoid circular dependency
// import useAuthStore from '../store/useAuthStore'; 

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tự động đính kèm Token vào Header mỗi khi gọi API
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Lazy load store to avoid circular dependency with useAuthStore importing apiClient
      const useAuthStore = require('../store/useAuthStore').default;
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // Fallback if store is not ready
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
