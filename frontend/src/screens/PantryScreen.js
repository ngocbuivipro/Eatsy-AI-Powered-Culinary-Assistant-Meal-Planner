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
import { PANTRY_CATEGORIES, INGREDIENTS_BY_CATEGORY } from '../constants/pantryData';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48 - 12) / 2;

const PantryScreen = ({ navigation }) => {
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
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.brandRow}>
            <Ionicons name="basket" size={26} color="#526347" />
            <Text style={styles.brandText}>Eatsy</Text>
          </View>
          <View style={styles.avatar} />
        </View>
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.title}>AI Pantry</Text>
            <Text style={styles.subtitle}>What's in your fridge?</Text>
          </View>
          {selectedIngredients.length > 0 && (
            <TouchableOpacity 
              onPress={handleReset} 
              activeOpacity={0.6}
              style={styles.resetCircle}
            >
              <Ionicons name="refresh" size={20} color="#526347" />
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
                  isActive && styles.categoryTabActive
                ]}
              >
                <Text style={{ fontSize: 18 }}>{cat.icon}</Text>
                <Text style={[
                  styles.categoryTabText,
                  isActive && styles.categoryTabTextActive
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
                    isSelected && styles.ingredientCardActive
                  ]}
                >
                  <View style={[
                    styles.iconContainer,
                    isSelected && styles.iconContainerActive
                  ]}>
                    <Text style={{ fontSize: 24 }}>{item.emoji}</Text>
                  </View>
                  <Text style={[
                    styles.ingredientName,
                    isSelected && styles.ingredientNameActive
                  ]}>
                    {item.name}
                  </Text>
                  
                  {isSelected && (
                    <View style={styles.checkBadge}>
                      <Ionicons name="checkmark" size={12} color="#EAFED9" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={{ flex: 1, alignItems: 'center', marginTop: 40 }}>
              <Text style={{ color: '#9CA3AF' }}>No items in this category</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      {selectedIngredients.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.actionButton}
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
              
              // Chuyển sang màn hình kết quả với danh sách nguyên liệu
              navigation.navigate('PantryResults', { ingredients: ingredientsList });
            }}
          >
            <Ionicons name="restaurant" size={21} color="#EAFED9" />
            <Text style={styles.actionButtonText}>Make something tasty</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{selectedIngredients.length}</Text>
            </View>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 45 : 12,
    marginBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    color: '#526347',
    letterSpacing: -1,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: '#DEE5D7',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#2B352F',
    letterSpacing: -1.2,
  },
  subtitle: {
    fontSize: 17,
    color: '#57615B',
    marginTop: 2,
    opacity: 0.8,
  },
  resetCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
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
    borderColor: '#E5EBE5',
    backgroundColor: '#FFFFFF',
  },
  categoryTabActive: {
    backgroundColor: '#526347',
    borderColor: '#526347',
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#57615B',
  },
  categoryTabTextActive: {
    color: '#EAFED9',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  ingredientCardActive: {
    backgroundColor: '#D5E9C4',
    borderColor: '#526347',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#F2F6F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  ingredientName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#2B352F',
    lineHeight: 18,
  },
  ingredientNameActive: {
    color: '#46573B',
  },
  checkBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#526347',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#F8FAF6',
  },
  footer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 30 : 20, // Giảm mạnh giá trị này để nút nằm sát thanh Tab Bar hơn
    left: 24,
    right: 24,
    zIndex: 99, // Đảm bảo luôn nổi lên trên
  },
  actionButton: {
    backgroundColor: '#526347',
    height: 68,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#526347',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  countBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    marginLeft: 4,
  },
  countText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#EAFED9',
  }
});

export default PantryScreen;
