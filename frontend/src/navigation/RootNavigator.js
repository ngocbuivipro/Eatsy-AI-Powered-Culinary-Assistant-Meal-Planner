// [frontend/src/navigation/RootNavigator.js]
import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import AuthNavigator from './AuthNavigator';
import GreetingScreen from '../screens/GreetingScreen';
import RecipeDetailsScreen from '../screens/RecipeDetailsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import useAuthStore from '../store/useAuthStore';
import { COLORS } from '../constants/Colors';

const Stack = createNativeStackNavigator();

const WhiteTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.primary,
    background: COLORS.white,
    card: COLORS.white,
    text: COLORS.text,
    border: COLORS.border,
    notification: COLORS.primary,
  },
};

const RootNavigator = () => {
  const { isAuthenticated, isGreetingFinished, isLoading, init } = useAuthStore();

  useEffect(() => {
    init();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.white }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={WhiteTheme}>
      <View style={StyleSheet.absoluteFill}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'none',
            contentStyle: { backgroundColor: COLORS.white },
          }}
        >
          {!isAuthenticated ? (
            <Stack.Screen name="Auth" component={AuthNavigator} />
          ) : (
            <>
              <Stack.Screen name="Main" component={TabNavigator} />
              <Stack.Screen 
                name="RecipeDetails" 
                component={RecipeDetailsScreen} 
                options={{ animation: 'slide_from_bottom' }}
              />
              <Stack.Screen
                name="EditProfile"
                component={EditProfileScreen}
                options={{ animation: 'slide_from_right' }}
              />
            </>
          )}
        </Stack.Navigator>

        {isAuthenticated && !isGreetingFinished && (
          <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
            <GreetingScreen />
          </View>
        )}
      </View>
    </NavigationContainer>
  );
};

export default RootNavigator;
