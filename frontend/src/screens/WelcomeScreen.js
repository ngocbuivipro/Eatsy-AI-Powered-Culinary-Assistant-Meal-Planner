// [frontend/src/screens/WelcomeScreen.js]
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LoginBottomSheet from '../components/login/LoginBottomSheet';
import { COLORS } from '../constants/Colors';
import { STRINGS } from '../constants/Strings';

const { height } = Dimensions.get('window');

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const [isLoginVisible, setIsLoginVisible] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      {/* Background Decorative Blobs */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={{ backgroundColor: COLORS.primary + '15' }} className="absolute -top-24 -right-24 w-64 h-64 rounded-full" />
        <View style={{ backgroundColor: COLORS.secondary + '10' }} className="absolute -left-20 bottom-[15%] w-72 h-72 rounded-full" />
      </View>

      <View style={{ flex: 1, paddingHorizontal: 32 }}>
        
        {/* Mockup Area */}
        <View style={{ flex: 5.5, alignItems: 'center', justifyContent: 'center', paddingTop: 20 }}>
          <View style={[styles.phoneContainer, { shadowColor: '#000' }]}>
            <Image 
              source={require('../assets/images/phoneframe.png')} 
              style={styles.phoneFrame}
              resizeMode="stretch"
            />
            <View style={[styles.screenContainer, { backgroundColor: COLORS.white }]}>
              <Image 
                source={require('../assets/images/welcome_food.png')} 
                style={styles.foodImage}
                resizeMode="cover"
              />
              <View className="absolute bottom-8 self-center bg-white/95 px-5 py-2 rounded-full shadow-md">
                <Text style={{ color: '#222' }} className="font-bold tracking-widest text-[10px]">CULINARY FLOW</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Content Area */}
        <View style={{ flex: 4.5, justifyContent: 'center', alignItems: 'center' }}>
          
          <View className="items-center mb-8">
            <Text 
              style={[{ color: COLORS.text, fontSize: height < 750 ? 26 : 32 }]}
              className="font-extrabold text-center leading-[38px]"
            >
              You don't know what to{"\n"}eat today?
            </Text>
            <Text style={{ color: COLORS.textGray }} className="text-lg font-medium text-center mt-3">
              Let me handle this!
            </Text>
          </View>

          <View className="w-full">
            <TouchableOpacity 
              className="py-4 rounded-3xl shadow-sm items-center justify-center mb-4"
              style={{ backgroundColor: COLORS.primary }}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Register')}
            >
              <Text className="text-white text-lg font-bold">Get started</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className="py-3 items-center justify-center"
              onPress={() => setIsLoginVisible(true)}
              activeOpacity={0.6}
            >
              <Text style={{ color: COLORS.text }} className="text-lg font-bold">{STRINGS.AUTH.LOGIN_BUTTON}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <LoginBottomSheet 
        isVisible={isLoginVisible} 
        onClose={() => setIsLoginVisible(false)} 
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  phoneContainer: {
    width: '60%', 
    maxWidth: 240,
    aspectRatio: 0.48, 
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  phoneFrame: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 10,
  },
  screenContainer: {
    position: 'absolute',
    width: '90%', 
    height: '96%',
    top: '2%',
    borderRadius: 25, 
    overflow: 'hidden',
    zIndex: 5,
  },
  foodImage: {
    width: '100%',
    height: '100%',
  }
});

export default WelcomeScreen;
