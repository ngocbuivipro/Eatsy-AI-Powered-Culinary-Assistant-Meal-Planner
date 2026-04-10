import axios from 'axios';
import Constants from 'expo-constants';

// Dynamically detect the IP address of the host machine running Expo
// This ensures the app connects to the correct local API regardless of who runs it
const debuggerHost = Constants.expoConfig?.hostUri;
const localhost = debuggerHost?.split(':').shift();

// If localhost is not found (e.g. on web), fallback to standard localhost
const BASE_URL = localhost 
  ? `http://${localhost}:5050/api` 
  : 'http://localhost:5050/api';

console.log('Connecting to API at:', BASE_URL);

import useAuthStore from '../store/useAuthStore';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tự động đính kèm Token vào Header mỗi khi gọi API
apiClient.interceptors.request.use(
  async (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
