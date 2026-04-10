import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getMealTypeByTime, getTimeGreeting } from '../utils/timeHelper';
import { getRandomRecipes } from '../api/recipeService';
import RecipeCard from '../components/RecipeCard';

const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [mealType, setMealType] = useState(getMealTypeByTime());
  const [refreshing, setRefreshing] = useState(false);

  const fetchHomeContent = useCallback(async () => {
    try {
      setLoading(true);
      const currentMealType = getMealTypeByTime();
      setMealType(currentMealType);
      
      const result = await getRandomRecipes(currentMealType);
      if (result.success) {
        setRecipes(result.data.recipes || []);
      }
    } catch (error) {
      console.error('Failed to fetch home content:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchHomeContent();
  }, [fetchHomeContent]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHomeContent();
  };

  const handeRecipePress = (recipe) => {
    // Navigation to Details will be added later
    console.log('Selected recipe:', recipe.id);
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#4A5D4E" />
        <Text className="mt-4 text-gray-500 font-medium">Finding delicious recipes...</Text>
      </View>
    );
  }

  const heroRecipe = recipes[0];
  const listRecipes = recipes.slice(1);

  return (
    <ScrollView 
      className="flex-1 bg-gray-50"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4A5D4E']} />
      }
    >
      {/* Header & Greeting */}
      <View className="px-6 pt-12 pb-6">
        <Text className="text-gray-500 text-lg font-medium">{getTimeGreeting()}</Text>
        <Text className="text-3xl font-bold text-gray-900 mt-1">Ready to cook?</Text>
      </View>

      {/* Hero Section - Let's Cook */}
      {heroRecipe && (
        <View className="px-6 mb-8">
          <View className="relative bg-white rounded-3xl overflow-hidden shadow-md">
            <Image 
              source={{ uri: heroRecipe.image }} 
              className="w-full h-80 object-cover"
            />
            {/* Gradient Overlay for text readability (simulated with bg/opacity) */}
            <View className="absolute inset-x-0 bottom-0 bg-black/40 p-6">
              <Text className="text-white text-2xl font-bold" numberOfLines={2}>
                {heroRecipe.title}
              </Text>
              <TouchableOpacity 
                onPress={() => handeRecipePress(heroRecipe)}
                className="bg-green-600 self-start px-6 py-3 rounded-full mt-4 flex-row items-center"
              >
                <Text className="text-white font-bold text-lg">Let's Cook</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Secondary List */}
      <View className="px-6 pb-10">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold text-gray-900 capitalize">
            Popular for {mealType}
          </Text>
          <TouchableOpacity>
            <Text className="text-green-600 font-bold">See All</Text>
          </TouchableOpacity>
        </View>

        {listRecipes.map((item) => (
          <RecipeCard 
            key={item.id} 
            recipe={item} 
            onPress={handeRecipePress}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
