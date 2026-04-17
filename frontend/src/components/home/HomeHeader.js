// [frontend/src/components/home/HomeHeader.js]
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useAuthStore from '../../store/useAuthStore';
import { getTimeGreeting } from '../../utils/timeHelper';
import UserAvatar from '../common/UserAvatar';
import { COLORS } from '../../constants/Colors';

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
      backgroundColor: COLORS.background,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        {/* Greeting Text */}
        <View style={{ flex: 1, marginRight: 16 }}>
          <Text style={{
            fontSize: 11,
            fontWeight: '700',
            letterSpacing: 1.8,
            color: COLORS.textGray,
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
            color: COLORS.text,
            marginTop: 6,
          }}>
            What are we cooking{'\n'}{mealContext}
          </Text>
        </View>

        {/* User Avatar */}
        <UserAvatar size={44} />
      </View>
    </View>
  );
};

export default HomeHeader;
