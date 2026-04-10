import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { getHighResImage } from '../../utils/imageHelper';

/**
 * Alternating tall/short cards in a 2-column layout for visual rhythm.
 * Left column: tall card at top, short card at bottom
 * Right column: short card at top, tall card at bottom
 */
const CuratedGrid = ({ recipes, onRecipePress }) => {
  if (!recipes || recipes.length === 0) return null;

  const TALL = 220;
  const SHORT = 160;

  const renderCard = (item, imageHeight) => {
    if (!item) return <View style={{ flex: 1 }} />;
    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => onRecipePress(item)}
        activeOpacity={0.85}
        style={{ marginBottom: 16 }}
      >
        {/* Image */}
        <View style={{
          height: imageHeight,
          borderRadius: 20,
          overflow: 'hidden',
          backgroundColor: '#E9F0E9',
          shadowColor: '#2B352F',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.1,
          shadowRadius: 14,
          elevation: 4,
        }}>
          {item.image && (
            <Image
              source={{ uri: getHighResImage(item.image) }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          )}
          {/* Subtle bottom gradient overlay */}
          <View style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: imageHeight * 0.45,
            backgroundColor: 'transparent',
            // Simulate gradient with a semi-transparent view
          }}>
            <View style={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0,
              height: imageHeight * 0.45,
              backgroundColor: 'rgba(0,0,0,0.28)',
              borderRadius: 0,
            }} />
            {/* Time badge on image */}
            <View style={{
              position: 'absolute',
              bottom: 10,
              left: 10,
              backgroundColor: 'rgba(255,255,255,0.18)',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.25)',
            }}>
              <Text style={{ fontSize: 10, fontWeight: '700', color: '#fff', letterSpacing: 0.5 }}>
                {item.readyInMinutes} MIN
              </Text>
            </View>
          </View>
        </View>

        {/* Title below image */}
        <Text style={{
          fontSize: 13,
          fontWeight: '700',
          letterSpacing: -0.2,
          lineHeight: 17,
          color: '#2B352F',
          marginTop: 8,
          paddingHorizontal: 2,
        }} numberOfLines={2}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  // Split into left/right columns
  const leftColumn = [];
  const rightColumn = [];
  recipes.forEach((item, i) => {
    if (i % 2 === 0) leftColumn.push(item);
    else rightColumn.push(item);
  });

  return (
    <View style={{ paddingHorizontal: 24, paddingBottom: 120 }}>
      {/* Section Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <Text style={{
          fontSize: 24,
          fontWeight: '800',
          letterSpacing: -0.6,
          lineHeight: 30,
          color: '#2B352F',
        }}>
          Curated for you
        </Text>
        <TouchableOpacity>
          <Text style={{ fontSize: 13, fontWeight: '600', color: '#526347' }}>See all</Text>
        </TouchableOpacity>
      </View>

      {/* Staggered 2-Column Grid */}
      <View style={{ flexDirection: 'row', gap: 14 }}>
        {/* Left column — starts with TALL */}
        <View style={{ flex: 1 }}>
          {leftColumn.map((item, idx) =>
            renderCard(item, idx % 2 === 0 ? TALL : SHORT)
          )}
        </View>
        {/* Right column — starts with SHORT (offset effect) */}
        <View style={{ flex: 1, marginTop: 40 }}>
          {rightColumn.map((item, idx) =>
            renderCard(item, idx % 2 === 0 ? SHORT : TALL)
          )}
        </View>
      </View>
    </View>
  );
};

export default CuratedGrid;
