import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getHighResImage } from '../../utils/imageHelper';
import { COLORS } from '../../constants/Colors';
import { STRINGS } from '../../constants/Strings';
import TourTarget from '../tour/TourTarget';

const CuratedGrid = ({ recipes, onRecipePress, onStepActive }) => {
  if (!recipes || recipes.length === 0) return null;

  const getDifficulty = (item) => {
    if (item.readyInMinutes < 20) return 'Easy';
    if (item.readyInMinutes < 45) return 'Medium';
    return 'Hard';
  };

  const renderCard = (item) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => onRecipePress(item)}
      activeOpacity={0.8}
      style={[styles.card, { backgroundColor: COLORS.white, shadowColor: COLORS.primary }]}
    >
      {/* Left: Product Image */}
      <View style={[styles.imageContainer, { backgroundColor: COLORS.inputBg }]}>
        <Image
          source={{ uri: getHighResImage(item.image || item.imageUrl) }}
          style={styles.image}
        />
      </View>

      {/* Right: Product Info */}
      <View style={styles.infoContainer}>
        <Text style={[styles.recipeTitle, { color: COLORS.text }]} numberOfLines={2}>
          {item.title}
        </Text>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={12} color={COLORS.primary} />
            <Text style={[styles.statText, { color: COLORS.textGray }]}>{item.readyInMinutes || item.prepTime} min</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: COLORS.border }]} />
          <View style={styles.statItem}>
            <Ionicons name="bar-chart-outline" size={12} color={COLORS.primary} />
            <Text style={[styles.statText, { color: COLORS.textGray }]}>{getDifficulty(item)}</Text>
          </View>
        </View>

        <View style={styles.bottomRow}>
          <Text style={[styles.caloriesText, { color: COLORS.primary }]}>
            {item.calories || Math.round(Math.random() * 300 + 200)} kcal
          </Text>
          <TouchableOpacity style={[styles.addBtn, { backgroundColor: COLORS.inputBg }]}>
            <Ionicons name="chevron-forward" size={14} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TourTarget tourKey="home_curated" onActive={onStepActive}>
        {/* Section Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: COLORS.text }]}>{STRINGS.HOME.CURATED_TITLE || "Curated for you"}</Text>
          <TouchableOpacity>
            <Text style={[styles.seeAll, { color: COLORS.primary }]}>{STRINGS.COMMON.SEE_ALL || "See all"}</Text>
          </TouchableOpacity>
        </View>

        {/* Highlight first 2 items as part of the intro */}
        <View style={styles.list}>
          {recipes.slice(0, 2).map(renderCard)}
        </View>
      </TourTarget>

      {/* Remaining items outside of initial tour focus */}
      <View style={[styles.list, { marginTop: 16 }]}>
        {recipes.slice(2).map(renderCard)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 24,
    padding: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 18,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    flex: 1,
    paddingLeft: 16,
    justifyContent: 'center',
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.6,
  },
  statDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  caloriesText: {
    fontSize: 13,
    fontWeight: '700',
  },
  addBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default CuratedGrid;
