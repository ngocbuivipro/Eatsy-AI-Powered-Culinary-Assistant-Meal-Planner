import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Welcome"
      screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: '#ffffff' },
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ presentation: 'fullScreenModal' }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen} 
        options={{ presentation: 'fullScreenModal' }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
