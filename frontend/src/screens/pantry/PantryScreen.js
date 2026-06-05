// [frontend/src/screens/PantryScreen.js]
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  StyleSheet, 
  Dimensions,
  Platform,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PANTRY_CATEGORIES, INGREDIENTS_BY_CATEGORY } from '../constants/pantryData';
import UserAvatar from '../components/common/UserAvatar';
import { COLORS } from '../constants/Colors';
import { STRINGS } from '../constants/Strings';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48 - 12) / 2;

const PantryScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState('vegetables');
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const toggleIngredient = (id) => {
    setSelectedIngredients(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id) 
        : [...prev, id]
    );
  };

  const handleReset = () => {
    setSelectedIngredients([]);
  };

  const currentIngredients = INGREDIENTS_BY_CATEGORY[activeCategory] || [];

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      {/* Header */}
      <View style={[
        styles.header, 
        { paddingTop: insets.top + 16 }
      ]}>
        <View style={styles.headerTop}>
          <View style={styles.brandRow}>
            <Ionicons name="basket" size={26} color={COLORS.primary} />
            <Text style={[styles.brandText, { color: COLORS.primary }]}>Eatsy</Text>
          </View>
          <UserAvatar size={44} />
        </View>
        <View style={styles.titleRow}>
          <View>
            <Text style={[styles.title, { color: COLORS.text }]}>AI Pantry</Text>
            <Text style={[styles.subtitle, { color: COLORS.textGray }]}>What's in your fridge?</Text>
          </View>
          {selectedIngredients.length > 0 && (
            <TouchableOpacity 
              onPress={handleReset} 
              activeOpacity={0.6}
              style={[styles.resetCircle, { backgroundColor: COLORS.white }]}
            >
              <Ionicons name="refresh" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories Tabs */}
      <View style={styles.categoriesContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.categoriesContent}
        >
          {PANTRY_CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <TouchableOpacity 
                key={cat.id}
                onPress={() => setActiveCategory(cat.id)}
                style={[
                  styles.categoryTab,
                  { borderColor: COLORS.border, backgroundColor: COLORS.white },
                  isActive && { backgroundColor: COLORS.primary, borderColor: COLORS.primary }
                ]}
              >
                <Text style={{ fontSize: 18 }}>{cat.icon}</Text>
                <Text style={[
                  styles.categoryTabText,
                  { color: COLORS.textGray },
                  isActive && { color: COLORS.accent }
                ]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Ingredients Grid */}
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.gridContent}
      >
        <View style={styles.grid}>
          {currentIngredients.length > 0 ? (
            currentIngredients.map((item) => {
              const isSelected = selectedIngredients.includes(item.id);
              return (
                <TouchableOpacity 
                  key={item.id}
                  activeOpacity={0.8}
                  onPress={() => toggleIngredient(item.id)}
                  style={[
                    styles.ingredientCard,
                    { backgroundColor: COLORS.white },
                    isSelected && { backgroundColor: COLORS.secondary, borderColor: COLORS.primary }
                  ]}
                >
                  <View style={[
                    styles.iconContainer,
                    { backgroundColor: COLORS.inputBg },
                    isSelected && { backgroundColor: 'rgba(255, 255, 255, 0.4)' }
                  ]}>
                    <Text style={{ fontSize: 24 }}>{item.emoji}</Text>
                  </View>
                  <Text style={[
                    styles.ingredientName,
                    { color: COLORS.text },
                    isSelected && { color: COLORS.primary }
                  ]}>
                    {item.name}
                  </Text>
                  
                  {isSelected && (
                    <View style={[styles.checkBadge, { backgroundColor: COLORS.primary, borderColor: COLORS.background }]}>
                      <Ionicons name="checkmark" size={12} color={COLORS.accent} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={{ flex: 1, alignItems: 'center', marginTop: 40 }}>
              <Text style={{ color: COLORS.placeholder }}>No items in this category</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      {selectedIngredients.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: COLORS.primary, shadowColor: COLORS.primary }]}
            onPress={() => {
              const ingredientsList = selectedIngredients
                .map(id => {
                  for (let cat in INGREDIENTS_BY_CATEGORY) {
                    const found = INGREDIENTS_BY_CATEGORY[cat].find(i => i.id === id);
                    if (found) return found.name;
                  }
                  return null;
                })
                .filter(n => n)
                .join(',');
              
              navigation.navigate('PantryResults', { ingredients: ingredientsList });
            }}
          >
            <Ionicons name="restaurant" size={21} color={COLORS.accent} />
            <Text style={[styles.actionButtonText, { color: COLORS.white }]}>Make something tasty</Text>
            <View style={[styles.countBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <Text style={[styles.countText, { color: COLORS.accent }]}>{selectedIngredients.length}</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandText: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -1.2,
  },
  subtitle: {
    fontSize: 17,
    marginTop: 2,
    opacity: 0.8,
  },
  resetCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    marginTop: 10,
  },
  categoriesContainer: {
    marginBottom: 28,
  },
  categoriesContent: {
    paddingHorizontal: 24,
    gap: 10,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  gridContent: {
    paddingHorizontal: 24,
    paddingBottom: 140,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  ingredientCard: {
    width: COLUMN_WIDTH,
    height: 82,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ingredientName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
  },
  checkBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
  },
  footer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 30 : 20,
    left: 24,
    right: 24,
    zIndex: 99,
  },
  actionButton: {
    height: 68,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    marginLeft: 4,
  },
  countText: {
    fontSize: 13,
    fontWeight: '800',
  }
});

export default PantryScreen;
