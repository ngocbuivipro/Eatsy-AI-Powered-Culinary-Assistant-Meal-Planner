// [frontend/src/screens/SplashScreen.js]
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/Colors';

const { width } = Dimensions.get('window');

const SplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const translateYAnim = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: translateYAnim }
            ]
          }
        ]}
      >
        <View style={styles.branding}>
          <Text style={styles.logoText}>Eatsy</Text>
          <Ionicons 
            name="sparkles-sharp" 
            size={32} 
            color={COLORS.primary} 
            style={styles.icon}
          />
        </View>
        <Text style={styles.slogan}>AI-Powered Culinary Assistant</Text>
      </Animated.View>
      
      <View style={styles.footer}>
        <Text style={styles.version}>v1.0.0</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  branding: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 56,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -1.5,
  },
  icon: {
    marginLeft: 8,
    marginTop: -8,
  },
  slogan: {
    fontSize: 14,
    color: COLORS.textGray,
    marginTop: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontWeight: '500',
    opacity: 0.7,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
  },
  version: {
    fontSize: 12,
    color: COLORS.textLight,
    opacity: 0.5,
  },
});

export default SplashScreen;
