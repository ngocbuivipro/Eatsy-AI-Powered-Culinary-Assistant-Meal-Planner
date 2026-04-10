import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import useAuthStore from '../store/useAuthStore';

const AnimatedPath = Animated.createAnimatedComponent(Path);

// Path duy nhất — toàn bộ "hello" viết tay Apple trong 1 nét liên tục
// h kết thúc tại ~(54,190), ello bắt đầu tại ~(55,181) → nối bằng L (lineto)
const HELLO_PATH =
  "M8.69214 166.553C36.2393 151.239 61.3409 131.548 89.8191 98.0295C109.203 75.1488 119.625 49.0228 120.122 31.0026C120.37 17.6036 113.836 7.43883 101.759 7.43883C88.3598 7.43883 79.9231 17.6036 74.7122 40.9363C69.005 66.5793 64.7866 96.0036 54.1166 190.356 " +
  "L55.1624 181.135C60.6251 133.114 81.4118 98.0479 107.963 98.0479C123.844 98.0479 133.937 110.703 131.071 128.817C129.457 139.487 127.587 150.405 125.408 163.06C122.869 178.941 130.128 191.348 152.122 191.348C184.197 191.348 219.189 173.523 237.097 145.915C243.198 136.509 245.68 128.073 245.928 119.884C246.176 104.996 237.739 93.8296 222.851 93.8296C203.992 93.8296 189.6 115.17 189.6 142.465C189.6 171.745 205.481 192.341 239.208 192.341C285.066 192.341 335.86 137.292 359.199 75.8585C365.788 58.513 368.26 42.4065 368.26 31.1512C368.26 17.8057 364.042 7.55823 352.131 7.55823C340.469 7.55823 332.777 16.6141 325.829 30.9129C317.688 47.4967 311.667 71.4162 309.203 98.4549C303 166.301 316.896 191.348 349.936 191.348C390 191.348 434.542 135.534 457.286 75.6686C463.803 58.513 466.275 42.4065 466.275 31.1512C466.275 17.8057 462.057 7.55823 450.146 7.55823C438.484 7.55823 430.792 16.6141 423.844 30.9129C415.703 47.4967 409.682 71.4162 407.218 98.4549C401.015 166.301 414.911 191.348 444.416 191.348C473.874 191.348 489.877 165.67 499.471 138.402C508.955 111.447 520.618 94.8221 544.935 94.8221C565.035 94.8221 580.916 109.71 580.916 137.75C580.916 168.768 560.792 192.093 535.362 192.341C512.984 192.589 498.285 174.475 499.774 147.179C501.511 116.907 519.873 94.8221 543.943 94.8221C557.839 94.8221 569.51 100.999 578.682 107.725C603.549 125.866 622.709 114.656 630.047 96.7186";

// Tổng độ dài path — đủ lớn để phủ hết nét
const TOTAL_PATH_LENGTH = 3600;

const GreetingScreen = () => {
  const { user, finishGreeting } = useAuthStore();

  // Chỉ CÒN 1 animation duy nhất → không bao giờ bị khựng
  const drawProgress = useRef(new Animated.Value(0)).current;

  const svgOpacity = useRef(new Animated.Value(0)).current;
  const nameOpacity = useRef(new Animated.Value(0)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;
  const nameTranslateY = useRef(new Animated.Value(12)).current;

  const strokeDashoffset = drawProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [TOTAL_PATH_LENGTH, 0],
  });

  useEffect(() => {
    Animated.sequence([
      // 1. Fade in ngay để tránh màn đen
      Animated.timing(svgOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),

      // 2. VẼ toàn bộ "hello" trong 1 animation liên tục — chậm và mượt
      Animated.timing(drawProgress, {
        toValue: 1,
        duration: 3500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      }),

      // 3. Giữ lại để ngắm
      Animated.delay(900),

      // 4. Chữ hello mờ đi
      Animated.timing(svgOpacity, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),

      // 5. Tên user nổi lên
      Animated.parallel([
        Animated.timing(nameOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(nameTranslateY, {
          toValue: 0,
          duration: 1000,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),

      // 6. Giữ tên lại
      Animated.delay(1400),

      // 7. Mờ dần toàn màn hình vào Home
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start(() => {
      finishGreeting();
    });
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: containerOpacity }]}>
      {/* Background blobs */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.blobTopRight} />
        <View style={styles.blobBottomLeft} />
      </View>

      {/* SVG Hello — 1 path duy nhất, không khựng */}
      <Animated.View style={[styles.svgWrapper, { opacity: svgOpacity }]}>
        <Svg
          width="224"
          height="72"
          viewBox="0 0 640 200"
          preserveAspectRatio="xMidYMid meet"
        >
          <AnimatedPath
            d={HELLO_PATH}
            fill="none"
            stroke="#2B352F"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={TOTAL_PATH_LENGTH}
            strokeDashoffset={strokeDashoffset}
          />
        </Svg>
      </Animated.View>

      {/* Tên user */}
      <Animated.View
        style={[
          styles.nameWrapper,
          {
            opacity: nameOpacity,
            transform: [{ translateY: nameTranslateY }],
          },
        ]}
      >
        <Text style={styles.welcomeText}>Welcome,</Text>
        <Text style={styles.nameText}>
          {user?.name?.split(' ')[0] || 'Chef'} 👋
        </Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  svgWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameWrapper: {
    position: 'absolute',
    alignItems: 'center',
  },
  welcomeText: {
    color: '#9CA3AF',
    fontSize: 26,
    fontWeight: '400',
    marginBottom: 6,
  },
  nameText: {
    color: '#2B352F',
    fontSize: 57,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  blobTopRight: {
    position: 'absolute',
    top: -96,
    right: -96,
    width: 256,
    height: 256,
    borderRadius: 999,
    backgroundColor: 'rgba(143, 163, 130, 0.06)',
  },
  blobBottomLeft: {
    position: 'absolute',
    left: -96,
    bottom: '30%',
    width: 320,
    height: 320,
    borderRadius: 999,
    backgroundColor: 'rgba(163, 130, 143, 0.03)',
  },
});

export default GreetingScreen;
