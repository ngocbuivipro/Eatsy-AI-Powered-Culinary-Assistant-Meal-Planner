// [frontend/src/components/common/UserAvatar.js]
import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import useAuthStore from '../../store/useAuthStore';
import { COLORS } from '../../constants/Colors';

const UserAvatar = ({ size = 42 }) => {
  const navigation = useNavigation();
  const { user } = useAuthStore();

  const getInitials = (name = '') =>
    name.trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  const initials = getInitials(user?.name || 'Eatsy');

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigation.navigate('ProfileTab')}
      style={[
        styles.avatarRing,
        { 
          width: size, 
          height: size, 
          borderRadius: size * 0.35,
          backgroundColor: COLORS.secondary,
          shadowColor: COLORS.primary 
        }
      ]}
    >
      <LinearGradient
        colors={[COLORS.primary, '#7A9467']}
        style={[styles.avatarGradient, { borderRadius: (size - 6) * 0.35 }]}
      >
        <Text style={[styles.avatarInitials, { fontSize: size * 0.35, color: COLORS.white }]}>
          {initials}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  avatarRing: {
    padding: 3,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

export default UserAvatar;
