import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Platform } from 'react-native';
import { House, CookingPot, MessageCircleCode, User } from 'lucide-react-native';

import HomeScreen from '../screens/HomeScreen';
import PantryNavigator from './PantryNavigator';

// Placeholder screens cho các tab còn lại
const Placeholder = ({ name }) => (
  <View style={{ flex: 1, backgroundColor: '#F8FAF6' }} />
);

const Tab = createBottomTabNavigator();

const TabBarIcon = ({ Icon, focused, size = 22 }) => {
  return (
    <View style={{
      width: 50,
      height: 50,
      borderRadius: 18,
      backgroundColor: focused ? '#EAFED9' : 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Icon 
        size={size} 
        color={focused ? '#2B352F' : '#6E7872'} 
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
          backgroundColor: '#FDFFFC',
          borderTopWidth: 1,
          borderTopColor: '#F0F4F0',
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingTop: 20, // Đưa icon lên trên một chút để cân bằng với phần padding bottom của iOS
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
        component={Placeholder} 
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon Icon={MessageCircleCode} focused={focused} />
        }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={Placeholder} 
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon Icon={User} focused={focused} />
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
