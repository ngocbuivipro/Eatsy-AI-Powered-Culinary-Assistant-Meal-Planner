import React, { useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Animated } from 'react-native';
import { getHighResImage } from '../../utils/imageHelper';

const getDifficulty = (r) => {
  if (!r?.readyInMinutes) return 'Easy';
  if (r.readyInMinutes < 20) return 'Easy';
  if (r.readyInMinutes < 45) return 'Medium';
  return 'Hard';
};

const HeroRecipe = ({ recipe, onLetsCook, onSomethingElse }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Effect to trigger animation when recipe changes
  useEffect(() => {
    // Reset and fade in when recipe updates
    fadeAnim.setValue(0);
    slideAnim.setValue(10); // Start 10px lower
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start();
  }, [recipe?.id]); 

  if (!recipe) return null;

  const highResImage = getHighResImage(recipe.image);
  
  // Spoonacular search results might use 'missedIngredients' + 'usedIngredients' or 'extendedIngredients'
  const ingredientsCount = (recipe.extendedIngredients?.length) || 
                          (recipe.usedIngredientCount + recipe.missedIngredientCount) || 0;

  return (
    <View style={{ paddingHorizontal: 24, marginBottom: 40 }}>
      <Animated.View style={{ 
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }]
      }}>
        {/* Hero Image */}
        <View style={{
          borderRadius: 28,
          overflow: 'hidden',
          aspectRatio: 1 / 1.05,
          backgroundColor: '#E9F0E9',
          shadowColor: '#526347',
          shadowOffset: { width: 0, height: 16 },
          shadowOpacity: 0.18,
          shadowRadius: 32,
          elevation: 12,
        }}>
          {highResImage && (
            <Image
              source={{ uri: highResImage }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          )}

          {/* AI SELECTED Badge */}
          <View style={{
            position: 'absolute',
            top: 20,
            right: 20,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'rgba(255,255,255,0.88)',
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.3)',
          }}>
            <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: '#526347', marginRight: 7 }} />
            <Text style={{ fontSize: 10, fontWeight: '700', letterSpacing: 0.5, color: '#2B352F' }}>
              AI SELECTED
            </Text>
          </View>
        </View>

        {/* Recipe Info */}
        <View style={{ marginTop: 24 }}>
          <Text style={{
            fontSize: 17,
            fontWeight: '500',
            color: '#57615B',
            opacity: 0.7,
            marginBottom: 6,
          }}>
            Tonight, we suggest…
          </Text>
          <Text style={{
            fontSize: 32,
            fontWeight: '800',
            letterSpacing: -1.2,
            lineHeight: 36,
            color: '#2B352F',
          }} numberOfLines={2}>
            {recipe.title}
          </Text>
        </View>

        {/* Stats Row */}
        <View style={{
          flexDirection: 'row',
          gap: 24,
          marginTop: 16,
          marginBottom: 28,
        }}>
          <View>
            <Text style={{ fontSize: 9, fontWeight: '700', letterSpacing: 1, color: '#57615B', textTransform: 'uppercase', opacity: 0.6, marginBottom: 2 }}>
              Prep
            </Text>
            <Text style={{ fontSize: 15, fontWeight: '600', color: '#2B352F' }}>
              {recipe.readyInMinutes} min
            </Text>
          </View>
          <View style={{ width: 1, backgroundColor: '#E0EBE0' }} />
          <View>
            <Text style={{ fontSize: 9, fontWeight: '700', letterSpacing: 1, color: '#57615B', textTransform: 'uppercase', opacity: 0.6, marginBottom: 2 }}>
              Difficulty
            </Text>
            <Text style={{ fontSize: 15, fontWeight: '600', color: '#2B352F' }}>
              {getDifficulty(recipe)}
            </Text>
          </View>
          <View style={{ width: 1, backgroundColor: '#E0EBE0' }} />
          <View>
            <Text style={{ fontSize: 9, fontWeight: '700', letterSpacing: 1, color: '#57615B', textTransform: 'uppercase', opacity: 0.6, marginBottom: 2 }}>
              Ingredients
            </Text>
            <Text style={{ fontSize: 15, fontWeight: '600', color: '#2B352F' }}>
              {ingredientsCount > 0 ? `${ingredientsCount} items` : '—'}
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Buttons - Fixed Outside Animated for immediate feel */}
      <View style={{ gap: 12 }}>
        <TouchableOpacity
          onPress={() => onLetsCook(recipe)}
          style={{
            backgroundColor: '#526347',
            borderRadius: 16,
            paddingVertical: 20,
            alignItems: 'center',
            shadowColor: '#526347',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          <Text style={{ fontSize: 17, fontWeight: '700', color: '#EAFED9', letterSpacing: -0.2 }}>
            Let's Cook  🍴
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onSomethingElse}
          style={{
            backgroundColor: '#D5E9C4',
            borderRadius: 16,
            paddingVertical: 20,
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 17, fontWeight: '700', color: '#46573B', letterSpacing: -0.2 }}>
            Something else?
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HeroRecipe;
