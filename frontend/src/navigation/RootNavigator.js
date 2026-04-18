// [frontend/src/navigation/RootNavigator.js]
import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import AuthNavigator from './AuthNavigator';
import GreetingScreen from '../screens/GreetingScreen';
import OnboardingScreen from '../screens/OnboardingScreen'; 
import RecipeDetailsScreen from '../screens/RecipeDetailsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import SplashScreen from '../screens/SplashScreen';
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
  const { isAuthenticated, isGreetingFinished, isOnboarded, isLoading, init } = useAuthStore();
  const [showSplash, setShowSplash] = React.useState(true);
  const splashOpacity = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (!isLoading && showSplash) {
      Animated.timing(splashOpacity, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        setShowSplash(false);
      });
    }
  }, [isLoading]);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <NavigationContainer theme={WhiteTheme}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'fade', // Dùng hiệu ứng fade cho mượt
            contentStyle: { backgroundColor: COLORS.white },
          }}
        >
          {!isAuthenticated ? (
            <Stack.Screen name="Auth" component={AuthNavigator} options={{ animation: 'fade' }} />
          ) : !isOnboarded ? (
            <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ animation: 'fade' }} />
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

        {/* Màn hình chào mừng chỉ hiện KHI ĐÃ onboarding xong */}
        {isAuthenticated && isOnboarded && !isGreetingFinished && (
          <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
            <GreetingScreen />
          </View>
        )}
      </NavigationContainer>

      {showSplash && (
        <Animated.View style={[StyleSheet.absoluteFill, { opacity: splashOpacity, zIndex: 999 }]}>
          <SplashScreen />
        </Animated.View>
      )}
    </View>
  );
};

export default RootNavigator;
