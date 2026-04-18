// [frontend/src/store/useTourStore.js]
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  }
};

const useTourStore = create((set, get) => ({
  completedTours: [], // Danh sách các màn hình đã xem tour
  isTourActive: false,
  activeTourId: null, // VD: 'home', 'pantry'
  currentStepIndex: 0,
  steps: [], // Các bước trong tour hiện tại
  
  // Tọa độ của target hiện tại
  targetLayout: { x: 0, y: 0, width: 0, height: 0 },

  init: async () => {
    try {
      const data = await safeStorage.getItem('completedTours');
      if (data) {
        set({ completedTours: JSON.parse(data) });
      }
    } catch (error) {
      console.warn('Tour store init error:', error);
    }
  },

  startTour: (tourId, tourSteps) => {
    const { completedTours } = get();
    // Nếu màn hình này đã xem tour rồi thì không chạy nữa
    if (completedTours.includes(tourId)) return;

    set({
      isTourActive: true,
      activeTourId: tourId,
      currentStepIndex: 0,
      steps: tourSteps,
      targetLayout: { x: 0, y: 0, width: 0, height: 0 }
    });
  },

  setTargetLayout: (layout) => {
    set({ targetLayout: layout });
  },

  nextStep: () => {
    const { currentStepIndex, steps, activeTourId, completedTours } = get();
    if (currentStepIndex < steps.length - 1) {
      // Clear layout cũ và tăng step
      set({ 
        currentStepIndex: currentStepIndex + 1,
        targetLayout: { x: 0, y: 0, width: 0, height: 0 }
      });
    } else {
      // Kết thúc tour
      const newCompleted = [...completedTours, activeTourId];
      safeStorage.setItem('completedTours', JSON.stringify(newCompleted));
      set({ 
        isTourActive: false, 
        currentStepIndex: 0, 
        activeTourId: null,
        completedTours: newCompleted,
        targetLayout: { x: 0, y: 0, width: 0, height: 0 }
      });
    }
  },

  skipTour: () => {
    const { activeTourId, completedTours } = get();
    const newCompleted = [...completedTours, activeTourId];
    safeStorage.setItem('completedTours', JSON.stringify(newCompleted));
    set({ 
      isTourActive: false, 
      currentStepIndex: 0, 
      activeTourId: null,
      completedTours: newCompleted,
      targetLayout: { x: 0, y: 0, width: 0, height: 0 }
    });
  }
}));

export default useTourStore;
