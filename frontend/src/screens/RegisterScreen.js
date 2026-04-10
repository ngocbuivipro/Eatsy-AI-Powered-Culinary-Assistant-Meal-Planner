import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import useAuthStore from '../store/useAuthStore';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const register = useAuthStore((state) => state.register);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
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
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 32 }}>
      <Text className="text-4xl font-bold text-gray-900 mb-2">Create Account</Text>
      <Text className="text-gray-500 mb-8 text-lg">Join Eatsy to start cooking</Text>

      <View>
        <View>
          <Text className="text-gray-700 font-medium mb-2">FullName</Text>
          <TextInput
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
            placeholder="John Doe"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View className="mt-4">
          <Text className="text-gray-700 font-medium mb-2">Email</Text>
          <TextInput
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
            placeholder="example@mail.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View className="mt-4">
          <Text className="text-gray-700 font-medium mb-2">Password</Text>
          <TextInput
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
            placeholder="********"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity 
          onPress={handleRegister}
          disabled={loading}
          className="bg-green-600 rounded-xl py-4 mt-8 flex-row justify-center items-center shadow-md"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">Register</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-500">Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text className="text-green-600 font-bold">Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default RegisterScreen;
