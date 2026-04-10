import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useAuthStore from '../../store/useAuthStore';
import { getTimeGreeting } from '../../utils/timeHelper';

const HomeHeader = () => {
  const { user } = useAuthStore();
  const insets = useSafeAreaInsets();
  const firstName = user?.name?.split(' ')[0] || 'Bạn';

  const timeGreeting = getTimeGreeting();

  const mealContext = (() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return 'for breakfast?';
    if (hour >= 11 && hour < 15) return 'for lunch?';
    if (hour >= 15 && hour < 18) return 'for a snack?';
    return 'for dinner?';
  })();

  return (
    <View style={{
      paddingTop: insets.top + 16,
      paddingBottom: 24,
      paddingHorizontal: 24,
      backgroundColor: '#F8FAF6',
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        {/* Greeting Text */}
        <View style={{ flex: 1, marginRight: 16 }}>
          <Text style={{
            fontSize: 11,
            fontWeight: '700',
            letterSpacing: 1.8,
            color: '#57615B',
            opacity: 0.8,
            textTransform: 'uppercase',
          }}>
            {timeGreeting}, {firstName}!
          </Text>
          <Text style={{
            fontSize: 30,
            fontWeight: '800',
            letterSpacing: -0.8,
            lineHeight: 36,
            color: '#2B352F',
            marginTop: 6,
          }}>
            What are we cooking{'\n'}{mealContext}
          </Text>
        </View>

        {/* User Avatar */}
        <TouchableOpacity style={{
          width: 44,
          height: 44,
          borderRadius: 14,
          backgroundColor: '#E2EAE3',
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 2,
        }}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={{ width: '100%', height: '100%' }} />
          ) : (
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#526347' }}>
              {firstName.charAt(0).toUpperCase()}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeHeader;
