// [frontend/src/screens/RegisterScreen.js]
import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ActivityIndicator,
  Alert, StyleSheet, Dimensions, Keyboard, Platform,
  TouchableWithoutFeedback, Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Asset } from 'expo-asset';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import useAuthStore from '../store/useAuthStore';
import { COLORS } from '../constants/Colors';
import { STRINGS } from '../constants/Strings';

// Preload hero asset ngay khi module được import
Asset.fromModule(require('../../assets/register_hero.png')).downloadAsync();

const { height } = Dimensions.get('window');
const HERO_HEIGHT = height * 0.3;

// ─────────────────────────────────────────────
// Sub-component: AuthInput với focus animation
// ─────────────────────────────────────────────
const AuthInput = ({ icon, label, value, onChangeText, placeholder, secureTextEntry, keyboardType, autoCapitalize, rightIcon, onRightIconPress }) => {
  const [isFocused, setIsFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(borderAnim, { toValue: 1, duration: 200, useNativeDriver: false }).start();
  };
  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(borderAnim, { toValue: 0, duration: 200, useNativeDriver: false }).start();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.border, COLORS.primary],
  });

  return (
    <View className="mb-4">
      <Text className="text-xs font-bold text-text-main uppercase tracking-widest mb-2 ml-0.5">
        {label}
      </Text>
      <Animated.View
        style={{ borderColor }}
        className="flex-row items-center bg-white border-[1.5px] rounded-2xl h-14 px-4 shadow-sm"
      >
        <Ionicons
          name={icon}
          size={18}
          color={isFocused ? COLORS.primary : COLORS.placeholder}
          style={{ marginRight: 12 }}
        />
        <TextInput
          className="flex-1 text-[15px] text-text-main h-full"
          placeholder={placeholder}
          placeholderTextColor={COLORS.placeholder}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize || 'none'}
        />
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} className="p-1">
            <Ionicons name={rightIcon} size={20} color={COLORS.placeholder} />
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
};

// ─────────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────────
const RegisterScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const imageOpacity = useRef(new Animated.Value(0)).current;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const register = useAuthStore((state) => state.register);

  const handleImageLoad = () => {
    Animated.timing(imageOpacity, {
      toValue: 1, duration: 300, useNativeDriver: true,
    }).start();
  };

  const handleRegister = async () => {
    Keyboard.dismiss();
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert(STRINGS.AUTH.VALIDATION_ERROR, STRINGS.AUTH.FILL_ALL_FIELDS);
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert(STRINGS.AUTH.VALIDATION_ERROR, 'Passwords do not match.');
      return;
    }
    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);
    if (!result.success) {
      Alert.alert('Registration Failed', result.message);
    } else {
      // Chuyển hướng ngay sang màn Login và điền sẵn email
      navigation.navigate('Login', { email });
    }
  };

  return (
    <View className="flex-1 bg-background">
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraHeight={120} // Khoảng đệm đẩy lên cao hơn bàn phím (đơn vị pixel)
        extraScrollHeight={Platform.OS === 'ios' ? 20 : 0}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        {/* ── Hero Image ── */}
        <View style={{ height: HERO_HEIGHT }} className="w-full overflow-hidden">
          <View className="absolute inset-0 bg-accent" />
          <Animated.Image
            source={require('../../assets/register_hero.png')}
            style={{ width: '100%', height: '100%', opacity: imageOpacity, position: 'absolute' }}
            resizeMode="cover"
            onLoad={handleImageLoad}
          />
          <LinearGradient
            colors={['transparent', 'rgba(248,250,246,0.5)', '#F8FAF6']}
            locations={[0.1, 0.6, 1]}
            style={StyleSheet.absoluteFill}
          />
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ top: insets.top + 12 }}
            className="absolute left-5 w-10 h-10 bg-white/80 rounded-xl items-center justify-center z-50"
          >
            <Ionicons name="arrow-back" size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {/* ── Form ── */}
        <View className="-mt-6 px-6 pb-10">
          <View className="mb-6">
            <Text className="text-[28px] font-extrabold text-text-main tracking-tight mb-1">
              Create Account
            </Text>
            <Text className="text-[14px] text-text-gray font-medium leading-5">
              Join Eatsy and start your culinary journey 🌿
            </Text>
          </View>

          <AuthInput
            icon="person-outline"
            label="Full Name"
            placeholder="John Doe"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <AuthInput
            icon="mail-outline"
            label={STRINGS.AUTH.EMAIL_LABEL}
            placeholder={STRINGS.AUTH.EMAIL_PLACEHOLDER}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <AuthInput
            icon="lock-closed-outline"
            label={STRINGS.AUTH.PASSWORD_LABEL}
            placeholder={STRINGS.AUTH.PASSWORD_PLACEHOLDER}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
            onRightIconPress={() => setShowPassword(!showPassword)}
          />

          <AuthInput
            icon="shield-checkmark-outline"
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            rightIcon={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
            onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
          />

          {/* CTA Button */}
          <TouchableOpacity
            onPress={handleRegister}
            disabled={loading}
            style={{ shadowColor: COLORS.primary }}
            className={`bg-primary rounded-[20px] h-[60px] items-center justify-center shadow-lg mt-2 mb-7 ${loading ? 'opacity-70' : ''}`}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-[17px] font-extrabold tracking-wide">
                Create Account
              </Text>
            )}
          </TouchableOpacity>

          {/* Footer */}
          <View className="flex-row justify-center items-center">
            <Text className="text-text-light text-[15px]">Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text className="text-primary font-extrabold text-[15px]">
                {STRINGS.AUTH.LOGIN_BUTTON}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default RegisterScreen;
