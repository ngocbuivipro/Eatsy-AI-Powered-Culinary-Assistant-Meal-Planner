import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import AuthNavigator from './AuthNavigator';
import GreetingScreen from '../screens/GreetingScreen';
import useAuthStore from '../store/useAuthStore';

const Stack = createNativeStackNavigator();

const WhiteTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#8FA382',
    background: '#ffffff',
    card: '#ffffff',
    text: '#2B352F',
    border: '#E5E7EB',
    notification: '#8FA382',
  },
};

const RootNavigator = () => {
  const { isAuthenticated, isGreetingFinished, isLoading, init } = useAuthStore();

  useEffect(() => {
    init();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={WhiteTheme}>
      <Stack.Navigator screenOptions={{ 
        headerShown: false,
        animation: 'fade', 
        contentStyle: { backgroundColor: '#ffffff' } 
      }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : !isGreetingFinished ? (
          <Stack.Screen name="Greeting" component={GreetingScreen} />
        ) : (
          <Stack.Screen name="Main" component={TabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
