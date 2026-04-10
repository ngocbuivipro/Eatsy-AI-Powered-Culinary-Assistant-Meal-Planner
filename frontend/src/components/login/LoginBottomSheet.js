import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Pressable, Animated, Dimensions, Easing } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

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
    // Delay navigation slightly to allow sheet to animate down
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
          style={{ transform: [{ translateY: slideAnim }] }}
          className="w-full bg-white rounded-t-[40px] pt-8 pb-12 px-8 shadow-2xl"
        >
          <View className="w-12 h-1.5 bg-[#e2eae3] rounded-full self-center mb-6" />

          <Text className="text-[#2B352F] text-3xl font-bold text-center mb-8">Log in</Text>

          <View className="w-full">
            <LoginButton 
              icon={<Ionicons name="logo-apple" size={24} color="white" />}
              label="Sign in with Apple"
              bgClass="bg-[#0c0f0d]"
              textColor="text-white"
            />
            <LoginButton 
              icon={<Ionicons name="logo-google" size={24} color="#EA4335" />}
              label="Sign in with Google"
              bgClass="bg-white"
              borderClass="border border-[#aab5ad4c]"
              textColor="text-[#2B352F]"
            />
            <LoginButton 
              icon={<MaterialCommunityIcons name="email-outline" size={24} color="#2B352F" />}
              label="Continue with Email"
              bgClass="bg-white"
              borderClass="border border-[#aab5ad4c]"
              textColor="text-[#2B352F]"
              onPress={handleEmailLogin}
            />
          </View>

          <View className="mt-8 items-center">
            <Text className="text-[#57615B] opacity-60 text-xs text-center leading-5">
              By continuing, you agree to Eatsy's{"\n"}
              Terms of Service and Privacy Policy.
            </Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const LoginButton = ({ icon, label, bgClass, borderClass = '', textColor, onPress }) => (
  <TouchableOpacity 
    className={`${bgClass} ${borderClass} flex-row items-center justify-center px-8 py-4 rounded-2xl shadow-sm mb-4`}
    activeOpacity={0.7}
    onPress={onPress}
  >
    <View className="absolute left-6">
      {icon}
    </View>
    <Text className={`${textColor} text-base font-semibold`}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});

export default LoginBottomSheet;
