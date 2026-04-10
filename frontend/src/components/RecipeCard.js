import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

const RecipeCard = ({ recipe, onPress }) => {
  return (
    <TouchableOpacity 
      onPress={() => onPress(recipe)}
      className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden border border-gray-100"
      activeOpacity={0.8}
    >
      <Image 
        source={{ uri: recipe.image || 'https://via.placeholder.com/300' }} 
        className="w-full h-40 object-cover"
      />
      <View className="p-4">
        <Text className="text-lg font-bold text-gray-800" numberOfLines={1}>
          {recipe.title}
        </Text>
        <View className="flex-row items-center mt-2">
          <Text className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-full">
            Ready in {recipe.readyInMinutes}m
          </Text>
          {recipe.healthScore > 0 && (
            <Text className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full ml-2">
              Score: {recipe.healthScore}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RecipeCard;
