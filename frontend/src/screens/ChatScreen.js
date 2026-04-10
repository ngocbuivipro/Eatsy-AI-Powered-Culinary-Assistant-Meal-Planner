import React from 'react';
import { View, Text } from 'react-native';

const ChatScreen = () => {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-bold text-gray-800">Chat Screen</Text>
      <Text className="text-gray-500 mt-2">Chat with your AI culinary assistant.</Text>
    </View>
  );
};

export default ChatScreen;
