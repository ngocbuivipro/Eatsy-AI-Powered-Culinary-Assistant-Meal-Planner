import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import SpotlightTour from './src/components/tour/SpotlightTour';
import useTourStore from './src/store/useTourStore';
import useAuthStore from './src/store/useAuthStore';
import './global.css';

export default function App() {
  const initStores = async () => {
    await Promise.all([
      useAuthStore.getState().init(),
      useTourStore.getState().init(),
    ]);
  };

  useEffect(() => {
    initStores();
  }, []);

  return (
    <SafeAreaProvider>
      <RootNavigator />
      <SpotlightTour />
    </SafeAreaProvider>
  );
}