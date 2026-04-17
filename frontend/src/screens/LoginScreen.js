// [frontend/src/screens/LoginScreen.js]
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView, StyleSheet, Dimensions, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import useAuthStore from '../store/useAuthStore';
import { COLORS } from '../constants/Colors';
import { STRINGS } from '../constants/Strings';
import { ENDPOINTS } from '../constants/Endpoints';

const { height } = Dimensions.get('window');

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const login = useAuthStore((state) => state.login);

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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        {/* Background Decorative Blobs */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <View 
            style={{ backgroundColor: COLORS.primary + '10' }}
            className="absolute -top-24 -right-24 w-64 h-64 rounded-full" 
          />
          <View 
            style={{ backgroundColor: COLORS.secondary + '08' }}
            className="absolute -left-24 bottom-[30%] w-80 h-80 rounded-full" 
          />
        </View>

        <View className="flex-1 px-8 pt-6">
          {/* Back Button */}
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={{ borderColor: COLORS.border }}
            className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm border mb-10"
          >
            <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          </TouchableOpacity>

          {/* Header */}
          <View className="mb-12">
            <Text style={{ color: COLORS.text }} className="text-4xl font-extrabold mb-2">
              {STRINGS.AUTH.WELCOME_BACK}
            </Text>
            <Text style={{ color: COLORS.textLight }} className="text-lg font-medium">
              {STRINGS.AUTH.SUBTITLE_LOGIN}
            </Text>
          </View>

          {/* Form */}
          <View>
            <View>
              <Text style={{ color: COLORS.text }} className="font-semibold mb-3 ml-1">
                {STRINGS.AUTH.EMAIL_LABEL}
              </Text>
              <TextInput
                style={{ 
                  textAlignVertical: 'center', 
                  backgroundColor: COLORS.inputBg, 
                  borderColor: COLORS.border,
                  color: COLORS.text
                }}
                className="border rounded-2xl h-16 px-6 text-base"
                placeholder={STRINGS.AUTH.EMAIL_PLACEHOLDER}
                placeholderTextColor={COLORS.placeholder}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View className="mt-8">
              <Text style={{ color: COLORS.text }} className="font-semibold mb-3 ml-1">
                {STRINGS.AUTH.PASSWORD_LABEL}
              </Text>
              <TextInput
                style={{ 
                  textAlignVertical: 'center', 
                  backgroundColor: COLORS.inputBg, 
                  borderColor: COLORS.border,
                  color: COLORS.text
                }}
                className="border rounded-2xl h-16 px-6 text-base"
                placeholder={STRINGS.AUTH.PASSWORD_PLACEHOLDER}
                placeholderTextColor={COLORS.placeholder}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <TouchableOpacity className="self-end mt-2">
                <Text style={{ color: COLORS.primary }} className="font-bold text-sm">
                  {STRINGS.AUTH.FORGOT_PASSWORD}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity 
            onPress={handleLogin}
            disabled={loading}
            style={{ backgroundColor: COLORS.primary, shadowColor: COLORS.primary }}
            className="rounded-3xl py-5 mt-10 flex-row justify-center items-center shadow-lg"
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text className="text-white font-bold text-xl">{STRINGS.AUTH.LOGIN_BUTTON}</Text>
            )}
          </TouchableOpacity>

          {/* Footer */}
          <View className="flex-row justify-center mt-auto pb-8">
            <Text style={{ color: COLORS.textLight }} className="text-base">
              {STRINGS.AUTH.DONT_HAVE_ACCOUNT}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={{ color: COLORS.primary }} className="font-bold text-base">
                {STRINGS.AUTH.REGISTER_LINK}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default LoginScreen;
