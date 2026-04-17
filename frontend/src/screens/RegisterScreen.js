// [frontend/src/screens/RegisterScreen.js]
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView, StyleSheet, Dimensions, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import useAuthStore from '../store/useAuthStore';
import { COLORS } from '../constants/Colors';
import { STRINGS } from '../constants/Strings';

const { height } = Dimensions.get('window');

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const register = useAuthStore((state) => state.register);

  const handleRegister = async () => {
    Keyboard.dismiss();

    if (!name || !email || !password || !confirmPassword) {
      Alert.alert(STRINGS.AUTH.VALIDATION_ERROR, 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Confirm password does not match');
      return;
    }

    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);

    if (!result.success) {
      Alert.alert('Registration Failed', result.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={[styles.container, { backgroundColor: COLORS.white }]}>
        {/* Background Decorative Blobs */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <View style={{ backgroundColor: COLORS.primary + '10' }} className="absolute -top-24 -right-24 w-64 h-64 rounded-full" />
          <View style={{ backgroundColor: COLORS.secondary + '08' }} className="absolute -left-24 bottom-[30%] w-80 h-80 rounded-full" />
        </View>

        <ScrollView 
          className="flex-1 px-8" 
          contentContainerStyle={{ flexGrow: 1, paddingTop: 24, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back Button */}
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={{ backgroundColor: COLORS.white, borderColor: COLORS.border }}
            className="w-12 h-12 rounded-full items-center justify-center shadow-sm border mb-8"
          >
            <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          </TouchableOpacity>

          {/* Header */}
          <View className="mb-10">
            <Text style={{ color: COLORS.text }} className="text-4xl font-extrabold mb-2">Create Account</Text>
            <Text style={{ color: COLORS.textGray }} className="text-lg font-medium">Join Eatsy to start cooking</Text>
          </View>

          {/* Form */}
          <View>
            <View>
              <Text style={{ color: COLORS.text }} className="font-semibold mb-3 ml-1">Full Name</Text>
              <TextInput
                style={{ textAlignVertical: 'center', backgroundColor: COLORS.inputBg, borderColor: COLORS.border, color: COLORS.text }}
                className="border rounded-2xl h-16 px-6 text-base"
                placeholder="John Doe"
                placeholderTextColor={COLORS.placeholder}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View className="mt-6">
              <Text style={{ color: COLORS.text }} className="font-semibold mb-3 ml-1">{STRINGS.AUTH.EMAIL_LABEL}</Text>
              <TextInput
                style={{ textAlignVertical: 'center', backgroundColor: COLORS.inputBg, borderColor: COLORS.border, color: COLORS.text }}
                className="border rounded-2xl h-16 px-6 text-base"
                placeholder={STRINGS.AUTH.EMAIL_PLACEHOLDER}
                placeholderTextColor={COLORS.placeholder}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View className="mt-6">
              <Text style={{ color: COLORS.text }} className="font-semibold mb-3 ml-1">{STRINGS.AUTH.PASSWORD_LABEL}</Text>
              <TextInput
                style={{ textAlignVertical: 'center', backgroundColor: COLORS.inputBg, borderColor: COLORS.border, color: COLORS.text }}
                className="border rounded-2xl h-16 px-6 text-base"
                placeholder={STRINGS.AUTH.PASSWORD_PLACEHOLDER}
                placeholderTextColor={COLORS.placeholder}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <View className="mt-6">
              <Text style={{ color: COLORS.text }} className="font-semibold mb-3 ml-1">Confirm Password</Text>
              <TextInput
                style={{ textAlignVertical: 'center', backgroundColor: COLORS.inputBg, borderColor: COLORS.border, color: COLORS.text }}
                className="border rounded-2xl h-16 px-6 text-base"
                placeholder={STRINGS.AUTH.PASSWORD_PLACEHOLDER}
                placeholderTextColor={COLORS.placeholder}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity 
            onPress={handleRegister}
            disabled={loading}
            style={{ backgroundColor: COLORS.primary, shadowColor: COLORS.primary }}
            className="rounded-3xl py-5 mt-10 flex-row justify-center items-center shadow-lg"
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text className="text-white font-bold text-xl">{STRINGS.AUTH.REGISTER_LINK}</Text>
            )}
          </TouchableOpacity>

          {/* Footer */}
          <View className="flex-row justify-center mt-10">
            <Text style={{ color: COLORS.textGray }} className="text-base">{STRINGS.AUTH.DONT_HAVE_ACCOUNT.replace('Don\'t', 'Already')} </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={{ color: COLORS.primary }} className="font-bold text-base">{STRINGS.AUTH.LOGIN_BUTTON}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default RegisterScreen;
