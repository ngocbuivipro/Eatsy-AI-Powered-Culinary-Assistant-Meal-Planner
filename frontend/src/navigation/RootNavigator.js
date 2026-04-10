import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' }}>
        <ActivityIndicator size="large" color="#526347" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={WhiteTheme}>
      {/* 
        Main navigator chỉ biết 2 trạng thái: Auth hoặc Main.
        Greeting không còn là 1 screen trong navigator nữa, tránh hoàn toàn
        việc unmount/mount gây ra flash đen.
        animation: 'none' vì GreetingScreen overlay sẽ tự handle transition.
      */}
      <View style={StyleSheet.absoluteFill}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'none',
            contentStyle: { backgroundColor: '#ffffff' },
          }}
        >
          {!isAuthenticated ? (
            <Stack.Screen name="Auth" component={AuthNavigator} />
          ) : (
            <Stack.Screen name="Main" component={TabNavigator} />
          )}
        </Stack.Navigator>

        {/*
          GreetingScreen là một OVERLAY tuyệt đối — không liên quan đến navigator.
          Nó "đè" lên toàn màn hình ngay sau khi login thành công.
          Phía dưới nó, Main tab đã mount và load data sẵn sàng.
          Khi GreetingScreen fade out → Main tab lộ ra mượt mà, zero flash.
        */}
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
