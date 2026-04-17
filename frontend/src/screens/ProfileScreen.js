// [frontend/src/screens/ProfileScreen.js]
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import useAuthStore from '../store/useAuthStore';
import { COLORS } from '../constants/Colors';
import { STRINGS } from '../constants/Strings';

const { width } = Dimensions.get('window');

// ─── Helper: Generate avatar initials ────────────────────────────────────────
const getInitials = (name = '') =>
  name.trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

// ─── Helper: Format diet type label ──────────────────────────────────────────
const DIET_LABELS = {
  omnivore: 'Omnivore',
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
  pescatarian: 'Pescatarian',
  keto: 'Keto',
  paleo: 'Paleo',
};

const GOAL_LABELS = {
  maintain: 'Maintain Weight',
  lose_weight: 'Lose Weight',
  gain_muscle: 'Gain Muscle',
  eat_healthier: 'Eat Healthier',
};

const GOAL_ICONS = {
  maintain: 'scale-outline',
  lose_weight: 'trending-down-outline',
  gain_muscle: 'barbell-outline',
  eat_healthier: 'leaf-outline',
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon, value, label, onPress }) => (
  <TouchableOpacity style={styles.statCard} onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
    <View style={[styles.statIconWrap, { backgroundColor: COLORS.inputBg }]}>
      <Ionicons name={icon} size={16} color={COLORS.primary} />
    </View>
    <Text style={[styles.statValue, { color: COLORS.text }]}>{value}</Text>
    <Text style={[styles.statLabel, { color: COLORS.placeholder }]}>{label}</Text>
  </TouchableOpacity>
);

// ─── Section Row (settings item) ─────────────────────────────────────────────
const SettingRow = ({ icon, label, value, onPress, danger = false }) => (
  <TouchableOpacity style={styles.settingRow} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.settingIconWrap, { backgroundColor: COLORS.inputBg }, danger && styles.settingIconDanger]}>
      <Ionicons name={icon} size={17} color={danger ? '#E53935' : COLORS.primary} />
    </View>
    <View style={styles.settingTextWrap}>
      <Text style={[styles.settingLabel, { color: COLORS.text }, danger && styles.settingLabelDanger]}>{label}</Text>
      {value ? <Text style={[styles.settingValue, { color: COLORS.placeholder }]}>{value}</Text> : null}
    </View>
    {!danger && <Ionicons name="chevron-forward" size={16} color={COLORS.border} />}
  </TouchableOpacity>
);

// ─── Tag Chip ─────────────────────────────────────────────────────────────────
const TagChip = ({ label }) => (
  <View style={[styles.tagChip, { backgroundColor: COLORS.secondary }]}>
    <Text style={[styles.tagChipText, { color: COLORS.primary }]}>{label}</Text>
  </View>
);

// ─── Main ProfileScreen ───────────────────────────────────────────────────────
const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuthStore();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      STRINGS.AUTH.LOGOUT_CONFIRM_TITLE || 'Sign Out',
      STRINGS.AUTH.LOGOUT_CONFIRM_MSG || 'Are you sure you want to sign out?',
      [
        { text: STRINGS.COMMON.CANCEL || 'Cancel', style: 'cancel' },
        {
          text: STRINGS.AUTH.LOGOUT_BUTTON || 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            setLoggingOut(true);
            await logout();
          },
        },
      ]
    );
  };

  const dietType = user?.dietaryPreferences?.dietType || 'omnivore';
  const goal = user?.healthGoals?.goal || 'maintain';
  const calories = user?.healthGoals?.dailyCalorieTarget || 2000;
  const allergies = user?.dietaryPreferences?.allergies || [];
  const cuisine = user?.dietaryPreferences?.cuisinePreferences || [];
  const savedCount = user?.savedRecipes?.length || 0;
  const initials = getInitials(user?.name);

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Hero Header ── */}
        <View style={styles.heroBlock}>
          {/* Avatar */}
          <View style={[styles.avatarRing, { backgroundColor: COLORS.secondary, shadowColor: COLORS.primary }]}>
            <LinearGradient
              colors={[COLORS.primary, '#7A9467']}
              style={styles.avatarGradient}
            >
              <Text style={styles.avatarInitials}>{initials}</Text>
            </LinearGradient>
          </View>

          <Text style={[styles.userName, { color: COLORS.text }]}>{user?.name || 'Eatsy User'}</Text>
          <Text style={[styles.userEmail, { color: COLORS.placeholder }]}>{user?.email}</Text>

          {/* Diet + Goal badges */}
          <View style={[styles.badgeRow, { backgroundColor: COLORS.white, borderColor: COLORS.border }]}>
            <View style={styles.badge}>
              <Ionicons name="restaurant-outline" size={12} color={COLORS.primary} />
              <Text style={[styles.badgeText, { color: COLORS.primary }]}>{DIET_LABELS[dietType]}</Text>
            </View>
            <View style={[styles.badgeDivider, { backgroundColor: COLORS.border }]} />
            <View style={styles.badge}>
              <Ionicons name={GOAL_ICONS[goal]} size={12} color={COLORS.primary} />
              <Text style={[styles.badgeText, { color: COLORS.primary }]}>{GOAL_LABELS[goal]}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.statsRow, { backgroundColor: COLORS.white, borderColor: COLORS.border }]}>
          <StatCard icon="flame-outline" value={`${calories}`} label="Daily kcal" />
          <View style={[styles.statsDivider, { backgroundColor: COLORS.border }]} />
          <StatCard icon="bookmark-outline" value={`${savedCount}`} label="Saved" />
          <View style={[styles.statsDivider, { backgroundColor: COLORS.border }]} />
          <StatCard
            icon="sparkles-outline"
            value="AI"
            label="Coach"
            onPress={() => navigation.navigate('AIChatTab')}
          />
        </View>

        {/* ── Dietary Preferences ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: COLORS.placeholder }]}>{STRINGS.PROFILE.DIETARY_PREFS || "Dietary Preferences"}</Text>

          <View style={[styles.prefCard, { backgroundColor: COLORS.white, borderColor: COLORS.border }]}>
            <View style={styles.prefRow}>
              <Text style={[styles.prefKey, { color: COLORS.placeholder }]}>Diet Type</Text>
              <Text style={[styles.prefVal, { color: COLORS.text }]}>{DIET_LABELS[dietType]}</Text>
            </View>
            <View style={[styles.prefDivider, { backgroundColor: COLORS.inputBg }]} />
            <View style={styles.prefRow}>
              <Text style={[styles.prefKey, { color: COLORS.placeholder }]}>Health Goal</Text>
              <Text style={[styles.prefVal, { color: COLORS.text }]}>{GOAL_LABELS[goal]}</Text>
            </View>

            {allergies.length > 0 && (
              <>
                <View style={[styles.prefDivider, { backgroundColor: COLORS.inputBg }]} />
                <View>
                  <Text style={[styles.prefKey, { color: COLORS.placeholder, marginTop: 12 }]}>Allergies</Text>
                  <View style={styles.tagRow}>
                    {allergies.map(a => <TagChip key={a} label={a} />)}
                  </View>
                </View>
              </>
            )}

            {cuisine.length > 0 && (
              <>
                <View style={[styles.prefDivider, { backgroundColor: COLORS.inputBg }]} />
                <View>
                  <Text style={[styles.prefKey, { color: COLORS.placeholder, marginTop: 12 }]}>Favourite Cuisines</Text>
                  <View style={styles.tagRow}>
                    {cuisine.map(c => <TagChip key={c} label={c} />)}
                  </View>
                </View>
              </>
            )}
          </View>
        </View>

        {/* ── Account Settings ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: COLORS.placeholder }]}>{STRINGS.PROFILE.ACCOUNT_SECTION || "Account"}</Text>
          <View style={[styles.settingCard, { backgroundColor: COLORS.white, borderColor: COLORS.border }]}>
            <SettingRow
              icon="person-outline"
              label={STRINGS.PROFILE.EDIT_PROFILE || "Edit Profile"}
              onPress={() => navigation.navigate('EditProfile')}
            />
            <View style={[styles.settingDivider, { backgroundColor: COLORS.inputBg }]} />
            <SettingRow
              icon="notifications-outline"
              label="Notifications"
              onPress={() => {}}
            />
            <View style={[styles.settingDivider, { backgroundColor: COLORS.inputBg }]} />
            <SettingRow
              icon="shield-checkmark-outline"
              label="Privacy & Security"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* ── App ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: COLORS.placeholder }]}>App</Text>
          <View style={[styles.settingCard, { backgroundColor: COLORS.white, borderColor: COLORS.border }]}>
            <SettingRow
              icon="help-circle-outline"
              label="Help & Support"
              onPress={() => {}}
            />
            <View style={[styles.settingDivider, { backgroundColor: COLORS.inputBg }]} />
            <SettingRow
              icon="information-circle-outline"
              label="About Eatsy"
              value="Version 1.0.0"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* ── Sign Out ── */}
        <View style={styles.section}>
          <View style={[styles.settingCard, { backgroundColor: COLORS.white, borderColor: COLORS.border }]}>
            <SettingRow
              icon="log-out-outline"
              label={STRINGS.AUTH.LOGOUT_BUTTON || "Sign Out"}
              onPress={handleLogout}
              danger
            />
          </View>
        </View>

        {/* Footer */}
        <Text style={[styles.footer, { color: COLORS.border }]}>Made with 🌿 by Eatsy</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Platform.OS === 'ios' ? 70 : 56,
    paddingBottom: 48,
  },
  heroBlock: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 28,
  },
  avatarRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    padding: 3,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 6,
  },
  avatarGradient: {
    flex: 1,
    borderRadius: 41,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.8,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 14,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    gap: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  badgeDivider: {
    width: 1,
    height: 14,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 24,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 10,
    marginBottom: 32,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  statsDivider: {
    width: 1,
    height: 34,
  },
  section: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginLeft: 4,
  },
  prefCard: {
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderWidth: 1,
  },
  prefRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  prefKey: {
    fontSize: 13,
    fontWeight: '600',
  },
  prefVal: {
    fontSize: 13,
    fontWeight: '700',
  },
  prefDivider: {
    height: 1,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
    paddingBottom: 12,
  },
  tagChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagChipText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  settingCard: {
    borderRadius: 20,
    paddingHorizontal: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    gap: 14,
  },
  settingIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingIconDanger: {
    backgroundColor: '#FFF0F0',
  },
  settingTextWrap: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  settingLabelDanger: {
    color: '#E53935',
  },
  settingValue: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
  settingDivider: {
    height: 1,
    marginLeft: 48,
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 8,
  },
});

export default ProfileScreen;
