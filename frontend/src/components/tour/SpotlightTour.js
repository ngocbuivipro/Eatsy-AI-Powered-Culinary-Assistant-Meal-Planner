// [frontend/src/components/tour/SpotlightTour.js]
import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  Animated, 
  Modal,
  ScrollView,
} from 'react-native';
import Svg, { Defs, Rect, Mask } from 'react-native-svg';
import useTourStore from '../../store/useTourStore';
import { COLORS } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const SpotlightTour = () => {
  const { 
    isTourActive, 
    currentStepIndex, 
    steps, 
    targetLayout, 
    nextStep, 
    skipTour 
  } = useTourStore();

  const currentStep = steps[currentStepIndex];
  
  // Animation values for spotlight
  const spotlightX = useRef(new Animated.Value(SCREEN_WIDTH / 2)).current;
  const spotlightY = useRef(new Animated.Value(SCREEN_HEIGHT / 2)).current;
  const spotlightW = useRef(new Animated.Value(0)).current;
  const spotlightH = useRef(new Animated.Value(0)).current;
  
  // Animation value for info card
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(20)).current;

  // Track if we should show the card (only after spotlight finished expanding)
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    if (isTourActive && targetLayout.width > 0) {
      setShowCard(false);
      cardOpacity.setValue(0);
      cardTranslateY.setValue(20);

      // Effect "Mở to sang ngang ôm trọn": bắt đầu từ tâm target và giãn ra
      const centerX = targetLayout.x + targetLayout.width / 2;
      const centerY = targetLayout.y + targetLayout.height / 2;

      // Reset spotlight to center of target with 0 size
      spotlightX.setValue(centerX);
      spotlightY.setValue(centerY);
      spotlightW.setValue(0);
      spotlightH.setValue(0);

      Animated.parallel([
        Animated.spring(spotlightX, { toValue: targetLayout.x - 3, useNativeDriver: false, bounciness: 4 }),
        Animated.spring(spotlightY, { toValue: targetLayout.y - 3, useNativeDriver: false, bounciness: 4 }),
        Animated.spring(spotlightW, { toValue: targetLayout.width + 6, useNativeDriver: false, bounciness: 4 }),
        Animated.spring(spotlightH, { toValue: targetLayout.height + 6, useNativeDriver: false, bounciness: 4 }),
      ]).start(() => {
        setShowCard(true);
        Animated.parallel([
          Animated.timing(cardOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.spring(cardTranslateY, { toValue: 0, useNativeDriver: true }),
        ]).start();
      });
    }
  }, [isTourActive, targetLayout, currentStepIndex]);

  if (!isTourActive || !currentStep) return null;
  
  // Render guard for card calculations
  const isTargetReady = targetLayout.width > 0;
  
  // Tính toán vị trí card dựa trên vị trí của target để tránh che khuất
  const isTargetInTopHalf = isTargetReady ? targetLayout.y < SCREEN_HEIGHT / 2 : true;
  
  // Tối ưu vị trí: Nếu target quá to, ưu tiên đặt card ở chỗ còn nhiều trống hơn
  const spaceTop = isTargetReady ? targetLayout.y : 0;
  const spaceBottom = isTargetReady ? SCREEN_HEIGHT - (targetLayout.y + targetLayout.height) : SCREEN_HEIGHT;
  
  const showOnBottom = spaceBottom > spaceTop;

  const cardPosition = isTargetReady 
    ? (showOnBottom 
        ? { top: Math.min(targetLayout.y + targetLayout.height + 20, SCREEN_HEIGHT - 220) } 
        : { bottom: Math.min(SCREEN_HEIGHT - targetLayout.y + 20, SCREEN_HEIGHT - 220) }
      )
    : { top: -1000 }; // Đẩy ra khỏi vùng nhìn thấy nếu chưa sẵn sàng

  return (
    <Modal transparent visible={isTourActive} animationType="fade">
      <View style={styles.container}>
        {/* Spotlight Overlay */}
        <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
          <Defs>
            <Mask id="mask">
              <Rect height="100%" width="100%" fill="white" />
              {targetLayout.width > 0 && (
                <AnimatedRect
                  x={spotlightX}
                  y={spotlightY}
                  width={spotlightW}
                  height={spotlightH}
                  rx={12}
                  ry={12}
                  fill="black"
                />
              )}
            </Mask>
          </Defs>
          <Rect
            height="100%"
            width="100%"
            fill="rgba(0,0,0,0.8)"
            mask="url(#mask)"
          />
        </Svg>

        <TouchableOpacity 
          style={StyleSheet.absoluteFill} 
          activeOpacity={1} 
          onPress={nextStep} 
        />

        {/* Info Card */}
        {showCard && (
          <Animated.View 
            style={[
              styles.card, 
              cardPosition,
              { opacity: cardOpacity, transform: [{ translateY: cardTranslateY }] }
            ]}
          >
            <View style={styles.cardHeader}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepText}>STEP {currentStepIndex + 1}/{steps.length}</Text>
              </View>
              <TouchableOpacity onPress={skipTour} hitSlop={10}>
                <Text style={styles.skipText}>Skip tour</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.title}>{currentStep.title}</Text>
            
            {/* Thêm ScrollView cho description phòng khi text dài hoặc màn nhỏ */}
            <View style={{ maxHeight: 120 }}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.description}>{currentStep.description}</Text>
              </ScrollView>
            </View>
            
            <View style={styles.footer}>
              <Text style={styles.tapHint}>Mẹo: Chạm bất kỳ đâu để tiếp tục</Text>
              <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
            </View>

            {/* Indicator Arrow - Chỉ hiện nếu card không quá sát biên */}
            <View style={[
                styles.arrow, 
                showOnBottom ? styles.arrowTop : styles.arrowBottom 
            ]} />
          </Animated.View>
        )}
      </View>
    </Modal>
  );
};

const AnimatedRect = Animated.createAnimatedComponent(Rect);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepBadge: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  stepText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
  },
  skipText: {
    fontSize: 12,
    color: COLORS.placeholder,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary || '#4B5563',
    lineHeight: 20,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 4,
  },
  tapHint: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary,
  },
  arrow: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: COLORS.white,
    transform: [{ rotate: '45deg' }],
    left: '50%',
    marginLeft: -10,
  },
  arrowTop: {
    top: -10,
  },
  arrowBottom: {
    bottom: -10,
  }
});

export default SpotlightTour;
