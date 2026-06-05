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
  Modal,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import useAuthStore from '../store/useAuthStore';
import { COLORS } from '../constants/Colors';
import { STRINGS } from '../constants/Strings';

const { width, height } = Dimensions.get('window');

// ─── Helper: Generate avatar initials ────────────────────────────────────────
const getInitials = (name = '') =>
  name.trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

// ─── Constants ───────────────────────────────────────────────────────────────
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

// ─── Sub-Components ──────────────────────────────────────────────────────────
const StatCard = ({ icon, value, label, onPress }) => (
  <TouchableOpacity style={styles.statCard} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.statIconWrap, { backgroundColor: COLORS.inputBg }]}>
      <Ionicons name={icon} size={16} color={COLORS.primary} />
    </View>
    <Text style={[styles.statValue, { color: COLORS.text }]}>{value}</Text>
    <Text style={[styles.statLabel, { color: COLORS.placeholder }]}>{label}</Text>
  </TouchableOpacity>
);

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

const TagChip = ({ label }) => (
  <View style={[styles.tagChip, { backgroundColor: COLORS.secondary }]}>
    <Text style={[styles.tagChipText, { color: COLORS.primary }]}>{label}</Text>
  </View>
);

// ─── Info Modal ───────────────────────────────────────────────────────────────
const InfoModal = ({ visible, onClose, title, children }) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
      <BlurView intensity={25} style={StyleSheet.absoluteFill} tint="light" />
      <TouchableOpacity activeOpacity={1} style={[styles.modalContent, { backgroundColor: COLORS.white }]}>
        <View style={styles.modalHeader}>
          <Text style={[styles.modalTitle, { color: COLORS.text }]}>{title}</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close-circle" size={24} color={COLORS.placeholder} />
          </TouchableOpacity>
        </View>
        <View style={styles.modalBody}>{children}</View>
      </TouchableOpacity>
    </TouchableOpacity>
  </Modal>
);

// ─── Main ProfileScreen ───────────────────────────────────────────────────────
const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuthStore();
  const [loggingOut, setLoggingOut] = useState(false);
  
  // States cho các Modal và Toggle (Giao diện)
  const [infoModal, setInfoModal] = useState({ visible: false, title: '', contentKey: null });
  const [notifState, setNotifState] = useState({ reminders: true, aiTips: true });

  const handleLogout = () => {
    Alert.alert(
      STRINGS.AUTH.LOGOUT_CONFIRM_TITLE || 'Sign Out',
      STRINGS.AUTH.LOGOUT_CONFIRM_MSG || 'Are you sure you want to sign out?',
      [
        { text: STRINGS.COMMON.CANCEL, style: 'cancel' },
        { text: STRINGS.AUTH.LOGOUT_BUTTON, style: 'destructive', onPress: async () => { setLoggingOut(true); await logout(); } },
      ]
    );
  };

  const dietType = user?.dietaryPreferences?.dietType || 'omnivore';
  const goal = user?.healthGoals?.goal || 'maintain';
  const calories = user?.healthGoals?.dailyCalorieTarget || 2000;
  const allergies = user?.dietaryPreferences?.allergies || [];
  const cuisine = user?.dietaryPreferences?.cuisinePreferences || [];
  const initials = getInitials(user?.name);

  // Renderers cho nội dung Modal
  const renderModalContent = () => {
    switch (infoModal.contentKey) {
      case 'kcal':
        return (
          <View style={styles.modalFlex}>
            <View style={[styles.infoBox, { backgroundColor: COLORS.secondary }]}>
              <Text style={[styles.infoHeading, { color: COLORS.primary }]}>Daily Target: {calories} kcal</Text>
              <Text style={[styles.infoText, { color: COLORS.textGray }]}>
                Calculated for **{GOAL_LABELS[goal]}**. This helps maintain your energy levels throughout the day.
              </Text>
            </View>
            <Text style={[styles.infoSubText, { color: COLORS.placeholder }]}>Calculated using the Mifflin-St Jeor formula.</Text>
          </View>
        );
      case 'notif':
        return (
          <View style={styles.modalFlex}>
            <View style={styles.switchRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.switchLabel, { color: COLORS.text }]}>Recipe Reminders</Text>
                <Text style={[styles.switchSub, { color: COLORS.placeholder }]}>Daily meal plan alerts</Text>
              </View>
              <Switch 
                value={notifState.reminders} 
                onValueChange={(v) => setNotifState(p => ({ ...p, reminders: v }))}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor={Platform.OS === 'ios' ? undefined : COLORS.white}
              />
            </View>
            <View style={[styles.switchRow, { marginTop: 24 }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.switchLabel, { color: COLORS.text }]}>AI Assistant Tips</Text>
                <Text style={[styles.switchSub, { color: COLORS.placeholder }]}>Smart nutritional advice</Text>
              </View>
              <Switch 
                value={notifState.aiTips} 
                onValueChange={(v) => setNotifState(p => ({ ...p, aiTips: v }))}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
                thumbColor={Platform.OS === 'ios' ? undefined : COLORS.white}
              />
            </View>
          </View>
        );
      case 'about':
        return (
          <View style={styles.modalFlex}>
            <View style={styles.aboutHeader}>
              <Ionicons name="leaf" size={42} color={COLORS.primary} />
              <Text style={[styles.versionText, { color: COLORS.text }]}>Eatsy v1.0.0 (Alpha)</Text>
            </View>
            <Text style={[styles.infoText, { color: COLORS.textGray, textAlign: 'center' }]}>
              Created with passion to help you master your kitchen and health with AI.
            </Text>
            <View style={styles.aboutMeta}>
              <Text style={[styles.metaText, { color: COLORS.placeholder }]}>© 2026 Eatsy AI Team</Text>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  const openModal = (title, key) => setInfoModal({ visible: true, title, contentKey: key });

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Hero Section */}
        <View style={styles.heroBlock}>
          <View style={[styles.avatarRing, { backgroundColor: COLORS.secondary, shadowColor: COLORS.primary }]}>
            <LinearGradient colors={[COLORS.primary, '#7A9467']} style={styles.avatarGradient}>
              <Text style={styles.avatarInitials}>{initials}</Text>
            </LinearGradient>
          </View>
          <Text style={[styles.userName, { color: COLORS.text }]}>{user?.name || 'Eatsy User'}</Text>
          <Text style={[styles.userEmail, { color: COLORS.placeholder }]}>{user?.email}</Text>
          <View style={[styles.badgeRow, { backgroundColor: COLORS.white, borderColor: COLORS.border }]}>
            <View style={styles.badge}><Ionicons name="restaurant-outline" size={12} color={COLORS.primary} /><Text style={[styles.badgeText, { color: COLORS.primary }]}>{DIET_LABELS[dietType]}</Text></View>
            <View style={[styles.badgeDivider, { backgroundColor: COLORS.border }]} />
            <View style={styles.badge}><Ionicons name={GOAL_ICONS[goal]} size={12} color={COLORS.primary} /><Text style={[styles.badgeText, { color: COLORS.primary }]}>{GOAL_LABELS[goal]}</Text></View>
          </View>
        </View>

        {/* Stats Row */}
        <View style={[styles.statsRow, { backgroundColor: COLORS.white, borderColor: COLORS.border }]}>
          <StatCard icon="flame-outline" value={`${calories}`} label="Daily kcal" onPress={() => openModal('Nutritional Target', 'kcal')} />
          <View style={[styles.statsDivider, { backgroundColor: COLORS.border }]} />
          <StatCard icon="bookmark-outline" value="8" label="Saved" onPress={() => navigation.navigate('DiscoveryTab')} />
          <View style={[styles.statsDivider, { backgroundColor: COLORS.border }]} />
          <StatCard icon="sparkles-outline" value="AI" label="Coach" onPress={() => navigation.navigate('AIChatTab')} />
        </View>

        {/* Sections */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: COLORS.placeholder }]}>Dietary Preferences</Text>
          <View style={[styles.prefCard, { backgroundColor: COLORS.white, borderColor: COLORS.border }]}>
            <TouchableOpacity style={styles.prefRow}><Text style={[styles.prefKey, { color: COLORS.placeholder }]}>Diet Type</Text><Text style={[styles.prefVal, { color: COLORS.text }]}>{DIET_LABELS[dietType]}</Text></TouchableOpacity>
            <View style={[styles.prefDivider, { backgroundColor: COLORS.inputBg }]} />
            <TouchableOpacity style={styles.prefRow}><Text style={[styles.prefKey, { color: COLORS.placeholder }]}>Health Goal</Text><Text style={[styles.prefVal, { color: COLORS.text }]}>{GOAL_LABELS[goal]}</Text></TouchableOpacity>
            {allergies.length > 0 && (
              <View><Text style={[styles.prefKey, { color: COLORS.placeholder, marginTop: 12 }]}>Allergies</Text><View style={styles.tagRow}>{allergies.map(a => <TagChip key={a} label={a} />)}</View></View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: COLORS.placeholder }]}>Account</Text>
          <View style={[styles.settingCard, { backgroundColor: COLORS.white, borderColor: COLORS.border }]}>
            <SettingRow icon="person-outline" label="Edit Profile" onPress={() => navigation.navigate('EditProfile')} />
            <View style={[styles.settingDivider, { backgroundColor: COLORS.inputBg }]} />
            <SettingRow icon="notifications-outline" label="Notifications" value={notifState.reminders ? 'On' : 'Off'} onPress={() => openModal('Notifications', 'notif')} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: COLORS.placeholder }]}>App</Text>
          <View style={[styles.settingCard, { backgroundColor: COLORS.white, borderColor: COLORS.border }]}>
            <SettingRow icon="help-circle-outline" label="Help & Support" onPress={() => {}} />
            <View style={[styles.settingDivider, { backgroundColor: COLORS.inputBg }]} />
            <SettingRow icon="information-circle-outline" label="About Eatsy" value="v1.0.0" onPress={() => openModal('About Eatsy', 'about')} />
            <View style={[styles.settingDivider, { backgroundColor: COLORS.inputBg }]} />
            <SettingRow icon="log-out-outline" label="Sign Out" onPress={handleLogout} danger />
          </View>
        </View>

        <Text style={[styles.footer, { color: COLORS.border }]}>Made with 🌿 by Eatsy</Text>
      </ScrollView>

      <InfoModal 
        visible={infoModal.visible} 
        onClose={() => setInfoModal({ ...infoModal, visible: false })}
        title={infoModal.title}
      >
        {renderModalContent()}
      </InfoModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingTop: Platform.OS === 'ios' ? 70 : 56, paddingBottom: 48 },
  heroBlock: { alignItems: 'center', paddingHorizontal: 24, paddingBottom: 28 },
  avatarRing: { width: 88, height: 88, borderRadius: 44, padding: 3, marginBottom: 16, elevation: 6 },
  avatarGradient: { flex: 1, borderRadius: 41, alignItems: 'center', justifyContent: 'center' },
  avatarInitials: { fontSize: 28, fontWeight: '800', color: '#FFF' },
  userName: { fontSize: 24, fontWeight: '800', marginBottom: 4 },
  userEmail: { fontSize: 13, marginBottom: 14 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1, gap: 10 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  badgeText: { fontSize: 12, fontWeight: '700' },
  badgeDivider: { width: 1, height: 14 },
  statsRow: { flexDirection: 'row', marginHorizontal: 24, borderRadius: 20, paddingVertical: 18, marginBottom: 32, borderWidth: 1, alignItems: 'center', justifyContent: 'space-around', elevation: 2 },
  statCard: { flex: 1, alignItems: 'center', gap: 4 },
  statIconWrap: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  statValue: { fontSize: 16, fontWeight: '800' },
  statLabel: { fontSize: 10, fontWeight: '600' },
  statsDivider: { width: 1, height: 34 },
  section: { marginHorizontal: 24, marginBottom: 24 },
  sectionTitle: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', marginBottom: 10, marginLeft: 4 },
  prefCard: { borderRadius: 20, paddingHorizontal: 18, paddingVertical: 6, borderWidth: 1 },
  prefRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14 },
  prefKey: { fontSize: 13, fontWeight: '600' },
  prefVal: { fontSize: 13, fontWeight: '700' },
  prefDivider: { height: 1 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8, paddingBottom: 12 },
  tagChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  tagChipText: { fontSize: 11, fontWeight: '700' },
  settingCard: { borderRadius: 20, paddingHorizontal: 18, borderWidth: 1, overflow: 'hidden' },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, gap: 14 },
  settingIconWrap: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  settingIconDanger: { backgroundColor: '#FFF0F0' },
  settingTextWrap: { flex: 1 },
  settingLabel: { fontSize: 14, fontWeight: '600' },
  settingLabelDanger: { color: '#E53935' },
  settingValue: { fontSize: 11, marginTop: 1 },
  settingDivider: { height: 1, marginLeft: 48 },
  footer: { textAlign: 'center', fontSize: 12, marginTop: 8 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  modalContent: { width: width * 0.85, borderRadius: 24, padding: 24, elevation: 15 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 18, fontWeight: '800' },
  modalBody: { minHeight: 80 },
  modalFlex: { gap: 10 },
  infoBox: { borderRadius: 16, padding: 16, gap: 8 },
  infoHeading: { fontSize: 14, fontWeight: '800' },
  infoText: { fontSize: 13, lineHeight: 20 },
  infoSubText: { fontSize: 11, fontStyle: 'italic', marginTop: 5 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  switchLabel: { fontSize: 14, fontWeight: '700' },
  switchSub: { fontSize: 12, marginTop: 2 },
  aboutHeader: { alignItems: 'center', gap: 12, marginBottom: 10 },
  versionText: { fontSize: 15, fontWeight: '800' },
  aboutMeta: { marginTop: 20, alignItems: 'center' }
});

export default ProfileScreen;
