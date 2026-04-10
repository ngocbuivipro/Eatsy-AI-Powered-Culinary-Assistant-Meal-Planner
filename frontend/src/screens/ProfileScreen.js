import React from 'react';
import { View, Text } from 'react-native';

const ProfileScreen = () => {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-bold text-gray-800">Profile Screen</Text>
      <Text className="text-gray-500 mt-2">Manage your account and settings.</Text>
    </View>
  );
};

export default ProfileScreen;
