// [frontend/src/navigation/TabNavigator.js]
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Platform } from 'react-native';
import { House, CookingPot, MessageCircleCode, User } from 'lucide-react-native';

import HomeScreen from '../screens/HomeScreen';
import PantryNavigator from './PantryNavigator';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { COLORS } from '../constants/Colors';

// Placeholder screens cho các tab còn lại
const Placeholder = ({ name }) => (
  <View style={{ flex: 1, backgroundColor: COLORS.background }} />
);

const Tab = createBottomTabNavigator();

const TabBarIcon = ({ Icon, focused, size = 22 }) => {
  return (
    <View style={{
      width: 50,
      height: 50,
      borderRadius: 18,
      backgroundColor: focused ? COLORS.secondary : 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Icon 
        size={size} 
        color={focused ? COLORS.text : COLORS.placeholder} 
        strokeWidth={focused ? 2.5 : 2}
      />
    </View>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingTop: 20, 
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon Icon={House} focused={focused} />
        }}
      />
      <Tab.Screen 
        name="PantryTab" 
        component={PantryNavigator} 
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon Icon={CookingPot} focused={focused} />
        }}
      />
      <Tab.Screen 
        name="AIChatTab" 
        component={ChatScreen} 
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon Icon={MessageCircleCode} focused={focused} />
        }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon Icon={User} focused={focused} />
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
