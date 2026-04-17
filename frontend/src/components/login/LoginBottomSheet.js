// [frontend/src/components/login/LoginBottomSheet.js]
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Pressable, Animated, Dimensions, Easing } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../constants/Colors';
import { STRINGS } from '../../constants/Strings';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const LoginBottomSheet = ({ isVisible, onClose }) => {
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(isVisible);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      setShowModal(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 10,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          easing: Easing.in(Easing.exp),
          useNativeDriver: true,
        })
      ]).start(() => {
        setShowModal(false);
      });
    }
  }, [isVisible]);

  const handleEmailLogin = () => {
    onClose();
    setTimeout(() => {
      navigation.navigate('Login');
    }, 300);
  };

  return (
    <Modal
      transparent={true}
      visible={showModal}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeAnim }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.2)' }]} />
            <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFill} />
          </Pressable>
        </Animated.View>

        <Animated.View 
          style={[{ transform: [{ translateY: slideAnim }], backgroundColor: COLORS.white }]}
          className="w-full rounded-t-[40px] pt-8 pb-12 px-8 shadow-2xl"
        >
          <View style={{ backgroundColor: COLORS.border }} className="w-12 h-1.5 rounded-full self-center mb-6" />

          <Text style={{ color: COLORS.text }} className="text-3xl font-bold text-center mb-8">{STRINGS.AUTH.LOGIN_BUTTON}</Text>

          <View className="w-full">
            <LoginButton 
              icon={<Ionicons name="logo-apple" size={24} color="white" />}
              label="Sign in with Apple"
              bgStyle={{ backgroundColor: '#0c0f0d' }}
              textColor="text-white"
            />
            <LoginButton 
              icon={<Ionicons name="logo-google" size={24} color="#EA4335" />}
              label="Sign in with Google"
              bgStyle={{ backgroundColor: COLORS.white, borderColor: COLORS.border, borderWidth: 1 }}
              textColor={`text-[${COLORS.text}]`}
              labelStyle={{ color: COLORS.text }}
            />
            <LoginButton 
              icon={<MaterialCommunityIcons name="email-outline" size={24} color={COLORS.text} />}
              label="Continue with Email"
              bgStyle={{ backgroundColor: COLORS.white, borderColor: COLORS.border, borderWidth: 1 }}
              textColor={`text-[${COLORS.text}]`}
              labelStyle={{ color: COLORS.text }}
              onPress={handleEmailLogin}
            />
          </View>

          <View className="mt-8 items-center">
            <Text style={{ color: COLORS.textGray, opacity: 0.6 }} className="text-xs text-center leading-5">
              By continuing, you agree to Eatsy's{"\n"}
              Terms of Service and Privacy Policy.
            </Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const LoginButton = ({ icon, label, bgStyle, labelStyle, onPress }) => (
  <TouchableOpacity 
    style={[bgStyle]}
    className={`flex-row items-center justify-center px-8 py-4 rounded-2xl shadow-sm mb-4`}
    activeOpacity={0.7}
    onPress={onPress}
  >
    <View className="absolute left-6">
      {icon}
    </View>
    <Text style={[labelStyle]} className={`text-base font-semibold`}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});

export default LoginBottomSheet;
