import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  SafeAreaView, 
  StyleSheet, 
  ActivityIndicator,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getHighResImage } from '../utils/imageHelper';
import apiClient from '../api/client';

const PantryResultsScreen = ({ route, navigation }) => {
  const { ingredients } = route.params;
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMatchedRecipes();
  }, []);

  const fetchMatchedRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      // Gọi API backend matchRecipes thông qua apiClient đã cấu hình sẵn
      const response = await apiClient.get(`/recipes/match?ingredients=${ingredients}`);
      if (response.data.status === 'success') {
        setRecipes(response.data.data);
      }
    } catch (error) {
      console.error('Error matching recipes:', error);
      setError('Connection failed. Please check your API points or internet.');
    } finally {
      setLoading(false);
    }
  };

  const renderRecipeItem = ({ item, index }) => {
    return (
      <TouchableOpacity 
        activeOpacity={0.9}
        style={styles.card}
        onPress={() => {
            // Sẽ dẫn tới màn RecipeDetails sau
            console.log('Pressed recipe:', item.id);
        }}
      >
        <Image 
          source={{ uri: getHighResImage(item.image) }} 
          style={styles.cardImage} 
        />
        <View style={styles.cardInfo}>
          <Text style={styles.recipeTitle} numberOfLines={2}>{item.title}</Text>
          
          <View style={styles.matchScoreRow}>
            <View style={styles.matchBadge}>
              <Text style={styles.matchBadgeText}>
                Match {item.usedIngredientCount}/{item.usedIngredientCount + item.missedIngredientCount}
              </Text>
            </View>
            <View style={styles.statsRow}>
              <Ionicons name="time-outline" size={14} color="#57615B" />
              <Text style={styles.statsText}>25 min</Text>
            </View>
          </View>

          {item.missedIngredientCount > 0 && (
            <Text style={styles.missedText}>
              Missing: {item.missedIngredients.map(i => i.name).slice(0, 2).join(', ')}...
            </Text>
          )}
        </View>
        <View style={styles.arrowIcon}>
          <Ionicons name="chevron-forward" size={20} color="#526347" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#2B352F" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Perfect Matches</Text>
          <Text style={styles.headerSubtitle}>Based on your pantry</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#526347" />
          <Text style={styles.loadingText}>Finding best recipes for you...</Text>
        </View>
      ) : error ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cloud-offline-outline" size={64} color="#DEE5D7" />
          <Text style={styles.emptyText}>Oops! Something went wrong</Text>
          <Text style={styles.emptySubtext}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchMatchedRecipes}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderRecipeItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="sad-outline" size={64} color="#DEE5D7" />
              <Text style={styles.emptyText}>No exact matches found.</Text>
              <Text style={styles.emptySubtext}>Try selecting more common ingredients.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAF6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2B352F',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#57615B',
    opacity: 0.7,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#57615B',
    fontSize: 15,
    fontWeight: '500',
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    alignItems: 'center',
  },
  cardImage: {
    width: 90,
    height: 90,
    borderRadius: 18,
    backgroundColor: '#F0F5F0',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 16,
    marginRight: 8,
  },
  recipeTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2B352F',
    marginBottom: 6,
    lineHeight: 22,
  },
  matchScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 6,
  },
  matchBadge: {
    backgroundColor: '#EAFED9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  matchBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#526347',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statsText: {
    fontSize: 12,
    color: '#57615B',
    fontWeight: '500',
  },
  missedText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  arrowIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2B352F',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#57615B',
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.7,
  },
  retryButton: {
    marginTop: 24,
    backgroundColor: '#526347',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 14,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  }
});

export default PantryResultsScreen;
