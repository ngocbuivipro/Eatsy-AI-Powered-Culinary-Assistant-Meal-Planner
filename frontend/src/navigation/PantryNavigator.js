import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PantryScreen from '../screens/PantryScreen';
import PantryResultsScreen from '../screens/PantryResultsScreen';

const Stack = createNativeStackNavigator();

const PantryNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="PantryMain" component={PantryScreen} />
      <Stack.Screen name="PantryResults" component={PantryResultsScreen} />
    </Stack.Navigator>
  );
};

export default PantryNavigator;
