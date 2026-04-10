import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView, StyleSheet, Dimensions, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import useAuthStore from '../store/useAuthStore';

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
      Alert.alert('Notice', 'Please fill in both email and password');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      Alert.alert('Login Failed', result.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        {/* Background Decorative Blobs */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <View className="absolute -top-24 -right-24 w-64 h-64 bg-[#8fa38210] rounded-full" />
          <View className="absolute -left-24 bottom-[30%] w-80 h-80 bg-[#a3828f08] rounded-full" />
        </View>

        <View className="flex-1 px-8 pt-6">
          {/* Back Button */}
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm border border-gray-100 mb-10"
          >
            <Ionicons name="chevron-back" size={24} color="#2B352F" />
          </TouchableOpacity>

          {/* Header */}
          <View className="mb-12">
            <Text className="text-[#2B352F] text-4xl font-extrabold mb-2">Welcome Back</Text>
            <Text className="text-[#717171] text-lg font-medium">Log in to your account</Text>
          </View>

          {/* Form */}
          <View>
            <View>
              <Text className="text-[#2B352F] font-semibold mb-3 ml-1">Email Address</Text>
              <TextInput
                style={{ textAlignVertical: 'center' }}
                className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl h-16 px-6 text-[#2B352F] text-base"
                placeholder="example@mail.com"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View className="mt-8">
              <Text className="text-[#2B352F] font-semibold mb-3 ml-1">Password</Text>
              <TextInput
                style={{ textAlignVertical: 'center' }}
                className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl h-16 px-6 text-[#2B352F] text-base"
                placeholder="********"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <TouchableOpacity className="self-end mt-2">
                <Text className="text-[#8FA382] font-bold text-sm">Forgot Password?</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity 
            onPress={handleLogin}
            disabled={loading}
            className="bg-[#8FA382] rounded-3xl py-5 mt-10 flex-row justify-center items-center shadow-lg shadow-[#8fa38233]"
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-xl">Log in</Text>
            )}
          </TouchableOpacity>

          {/* Footer */}
          <View className="flex-row justify-center mt-auto pb-8">
            <Text className="text-[#717171] text-base">Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text className="text-[#8FA382] font-bold text-base">Register</Text>
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
