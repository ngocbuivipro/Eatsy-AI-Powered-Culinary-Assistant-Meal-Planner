import React from 'react';
import { View, Text } from 'react-native';

const PantryScreen = () => {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-bold text-gray-800">Pantry Screen</Text>
      <Text className="text-gray-500 mt-2">Manage your ingredients here.</Text>
    </View>
  );
};

export default PantryScreen;
