// [frontend/src/screens/LoginScreen.js]
import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ActivityIndicator,
  Alert, StyleSheet, Dimensions, Keyboard, Platform,
  TouchableWithoutFeedback, Animated, KeyboardAvoidingView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Asset } from 'expo-asset';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import useAuthStore from '../store/useAuthStore';
import { COLORS } from '../constants/Colors';
import { STRINGS } from '../constants/Strings';

// Preload hero asset ngay khi module được import
Asset.fromModule(require('../../assets/login_hero.png')).downloadAsync();

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
    <View className="mb-5">
      <Text className="text-xs font-bold text-text-main uppercase tracking-widest mb-2 ml-0.5">
        {label}
      </Text>
      <Animated.View
        style={{ borderColor }}
        className="flex-row items-center bg-white border-[1.5px] rounded-2xl h-14 px-4"
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
const LoginScreen = ({ route }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const imageOpacity = useRef(new Animated.Value(0)).current;
  const [email, setEmail] = useState(route?.params?.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);

  const handleImageLoad = () => {
    Animated.timing(imageOpacity, {
      toValue: 1, duration: 300, useNativeDriver: true,
    }).start();
  };

  const handleLogin = async () => {
    Keyboard.dismiss();
    if (!email || !password) {
      Alert.alert(STRINGS.AUTH.VALIDATION_ERROR, STRINGS.AUTH.FILL_ALL_FIELDS);
      return;
    }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (!result.success) {
      Alert.alert(STRINGS.AUTH.LOGIN_FAILED, result.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 bg-background">

          {/* ── Hero Image ── */}
          <View style={{ height: HERO_HEIGHT }} className="w-full overflow-hidden">
            <View className="absolute inset-0 bg-secondary" />
            <Animated.Image
              source={require('../../assets/login_hero.png')}
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

          {/* ── Form Container ── */}
          <View className="flex-1 px-6 pt-2">
            <View className="mb-7">
              <Text className="text-[30px] font-extrabold text-text-main tracking-tight mb-1">
                {STRINGS.AUTH.WELCOME_BACK}
              </Text>
              <Text className="text-[15px] text-text-gray font-medium">
                {STRINGS.AUTH.SUBTITLE_LOGIN}
              </Text>
            </View>

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

            <TouchableOpacity className="self-end -mt-3 mb-8">
              <Text className="text-primary font-bold text-[13px]">
                {STRINGS.AUTH.FORGOT_PASSWORD}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              style={{ shadowColor: COLORS.primary }}
              className={`bg-primary rounded-[20px] h-[60px] items-center justify-center shadow-lg mb-8 ${loading ? 'opacity-70' : ''}`}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <View className="flex-row items-center">
                  <Text className="text-white text-[17px] font-extrabold tracking-wide">
                    {STRINGS.AUTH.LOGIN_BUTTON}
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color="white" style={{ marginLeft: 8 }} />
                </View>
              )}
            </TouchableOpacity>

            {/* Footer ở cuối View này */}
            <View className="flex-row justify-center items-center mt-auto mb-10">
              <Text className="text-text-light text-[15px]">
                {STRINGS.AUTH.DONT_HAVE_ACCOUNT}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text className="text-primary font-extrabold text-[15px] ml-1">
                  {STRINGS.AUTH.REGISTER_LINK}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
