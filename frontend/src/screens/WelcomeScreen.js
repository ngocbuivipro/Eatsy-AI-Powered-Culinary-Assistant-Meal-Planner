import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LoginBottomSheet from '../components/LoginBottomSheet';

const { height } = Dimensions.get('window');

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const [isLoginVisible, setIsLoginVisible] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      {/* Background Decorative Blobs */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View className="absolute -top-24 -right-24 w-64 h-64 bg-[#8fa38215] rounded-full" />
        <View className="absolute -left-20 bottom-[15%] w-72 h-72 bg-[#a3828f10] rounded-full" />
      </View>

      <View style={{ flex: 1, paddingHorizontal: 32 }}>
        
        {/* Mockup Area */}
        <View style={{ flex: 5.5, alignItems: 'center', justifyContent: 'center', paddingTop: 20 }}>
          {/* Main Phone Container (Constraints Aspect Ratio) */}
          <View style={styles.phoneContainer}>
            
            {/* The outer Phone Frame Shell */}
            <Image 
              source={require('../assets/images/phoneframe.png')} 
              style={styles.phoneFrame}
              resizeMode="stretch"
            />
            
            {/* The "Screen" inside the frame (Adjust percentages to fit bezel) */}
            <View style={styles.screenContainer}>
              <Image 
                source={require('../assets/images/welcome_food.png')} 
                style={styles.foodImage}
                resizeMode="cover"
              />
              
              {/* Overlay Tag Inside Screen */}
              <View className="absolute bottom-8 self-center bg-white/95 px-5 py-2 rounded-full shadow-md">
                <Text className="text-[#222] font-bold tracking-widest text-[10px]">CULINARY FLOW</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Content Area */}
        <View style={{ flex: 4.5, justifyContent: 'center', alignItems: 'center' }}>
          
          <View className="items-center mb-8">
            <Text 
              className="text-[#2B352F] font-extrabold text-center leading-[38px]"
              style={{ fontSize: height < 750 ? 26 : 32 }}
            >
              You don't know what to{"\n"}eat today?
            </Text>
            <Text className="text-[#57615B] text-lg font-medium text-center mt-3">
              Let me handle this!
            </Text>
          </View>

          <View className="w-full">
            <TouchableOpacity 
              className="bg-[#8FA382] py-4 rounded-3xl shadow-sm items-center justify-center mb-4"
              activeOpacity={0.8}
            >
              <Text className="text-white text-lg font-bold">Get started</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className="py-3 items-center justify-center"
              onPress={() => setIsLoginVisible(true)}
              activeOpacity={0.6}
            >
              <Text className="text-[#2B352F] text-lg font-bold">Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Login Bottom Sheet Modal */}
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
    aspectRatio: 0.48, // Standard phone aspect ratio (approx 9:19.5)
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
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
    width: '90%',   // These offsets simulate the screen inside the bezel
    height: '96%',
    top: '2%',
    borderRadius: 25, // Curve to match the bezel
    overflow: 'hidden',
    zIndex: 5,
    backgroundColor: '#fff',
  },
  foodImage: {
    width: '100%',
    height: '100%',
  }
});

export default WelcomeScreen;
