// [frontend/src/screens/HomeScreen.js]
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, ScrollView, RefreshControl, ActivityIndicator, Text } from 'react-native';
import { getMealTypeByTime } from '../utils/timeHelper';
import { getRandomRecipes } from '../api/recipeService';
import HomeHeader from '../components/home/HomeHeader';
import HeroRecipe from '../components/home/HeroRecipe';
import CuratedGrid from '../components/home/CuratedGrid';
import { COLORS } from '../constants/Colors';
import { STRINGS } from '../constants/Strings';

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
      
      const result = await getRandomRecipes(currentMealType);
      
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
    navigation.navigate('RecipeDetails', { recipeId: recipe.id });
  };

  const handleSomethingElse = () => {
    if (recipes.length > 0) {
      setHeroIndex((prev) => (prev + 1) % Math.min(recipes.length, 5));
    }
  };

  const handleLetsCook = (recipe) => {
    navigation.navigate('RecipeDetails', { recipeId: recipe.id });
  };

  const heroRecipe = useMemo(() => recipes[heroIndex], [recipes, heroIndex]);
  const curatedRecipes = useMemo(() => {
    if (recipes.length <= 1) return [];
    return recipes.filter((_, idx) => idx !== heroIndex).slice(0, 10);
  }, [recipes, heroIndex]);

  if (loading && !refreshing) {
    return (
      <View style={{ backgroundColor: COLORS.background }} className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ color: COLORS.textGray }} className="mt-4 font-medium">
          {STRINGS.COMMON.LOADING_RECIPES || "Coming up with something delicious..."}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={{ backgroundColor: COLORS.background }}
      className="flex-1"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
      }
    >
      <HomeHeader />

      <HeroRecipe 
        recipe={heroRecipe} 
        onLetsCook={handleLetsCook}
        onSomethingElse={handleSomethingElse}
      />

      <CuratedGrid 
        recipes={curatedRecipes}
        onRecipePress={handleRecipePress}
      />
    </ScrollView>
  );
};

export default HomeScreen;
