import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, ScrollView, RefreshControl, ActivityIndicator, Text } from 'react-native';
import { getMealTypeByTime } from '../utils/timeHelper';
import { getRandomRecipes } from '../api/recipeService';
import HomeHeader from '../components/home/HomeHeader';
import HeroRecipe from '../components/home/HeroRecipe';
import CuratedGrid from '../components/home/CuratedGrid';

const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [heroIndex, setHeroIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [mealType, setMealType] = useState(getMealTypeByTime());

  const fetchHomeContent = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      const currentMealType = getMealTypeByTime();
      setMealType(currentMealType);
      
      // Fetch 15 recipes to have enough for cycling and the grid
      const result = await getRandomRecipes(currentMealType);
      console.log('Home content result:', result.status);
      
      if (result.status === 'success') {
        setRecipes(result.data.recipes || []);
        setHeroIndex(0); 
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
    fetchHomeContent(true);
  };

  const handleRecipePress = (recipe) => {
    // Navigate to RecipeDetails when it's implemented
    console.log('Navigate to details for:', recipe.id);
  };

  const handleSomethingElse = () => {
    // Cycle to next hero recipe or wrap around
    if (recipes.length > 0) {
      setHeroIndex((prev) => (prev + 1) % Math.min(recipes.length, 5)); // Cycle through first 5
    }
  };

  // Memoize sections to avoid unnecessary re-renders
  const heroRecipe = useMemo(() => recipes[heroIndex], [recipes, heroIndex]);
  const curatedRecipes = useMemo(() => {
    if (recipes.length <= 1) return [];
    // Show rest of the recipes starting after the potential hero candidates
    // Or just all recipes except the current hero
    return recipes.filter((_, idx) => idx !== heroIndex).slice(0, 10);
  }, [recipes, heroIndex]);

  if (loading && !refreshing) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#526347" />
        <Text className="mt-4 text-eatsy-gray font-medium">Coming up with something delicious...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      className="flex-1 bg-background"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#526347']} />
      }
    >
      {/* Header with Greeting and Avatar */}
      <HomeHeader />

      {/* Main Feature - Hero Suggestion */}
      <HeroRecipe 
        recipe={heroRecipe} 
        onLetsCook={handleRecipePress}
        onSomethingElse={handleSomethingElse}
      />

      {/* Curated Grid Section */}
      <CuratedGrid 
        recipes={curatedRecipes}
        onRecipePress={handleRecipePress}
      />
      
    </ScrollView>
  );
};

export default HomeScreen;
