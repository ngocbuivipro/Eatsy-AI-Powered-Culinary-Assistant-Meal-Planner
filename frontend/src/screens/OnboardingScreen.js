// [frontend/src/screens/OnboardingScreen.js]
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import useAuthStore from '../store/useAuthStore';
import { COLORS } from '../constants/Colors';
import { STRINGS } from '../constants/Strings';
import { 
  ONBOARDING_GOALS, 
  DIET_TYPES, 
  ALLERGY_OPTIONS, 
  CUISINE_OPTIONS, 
  MEASUREMENT_SYSTEMS,
  APP_CONFIG 
} from '../constants/AppConstants';
import { ENDPOINTS } from '../constants/Endpoints';
import apiClient from '../api/client';

const { width } = Dimensions.get('window');

const OnboardingScreen = () => {
  const { completeOnboarding, user } = useAuthStore();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    goal: 'maintain',
    weight: '70',
    height: '175',
    calories: '2000',
    measurementSystem: 'metric',
    diet: 'Omnivore',
    allergies: [],
    cuisines: [],
  });

  const TOTAL_STEPS = 6;

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const toggleSelection = (item, field) => {
    const current = formData[field];
    if (current.includes(item)) {
      setFormData({ ...formData, [field]: current.filter(i => i !== item) });
    } else {
      setFormData({ ...formData, [field]: [...current, item] });
    }
  };

  const nextStep = async () => {
    if (step < TOTAL_STEPS - 1) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: APP_CONFIG.FADE_DURATION,
          useNativeDriver: true
        }),
        Animated.timing(slideAnim, {
          toValue: -20,
          duration: APP_CONFIG.FADE_DURATION,
          useNativeDriver: true
        }),
      ]).start(() => {
        setStep(step + 1);
        slideAnim.setValue(20);
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: APP_CONFIG.ANIMATION_DURATION,
            useNativeDriver: true
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: APP_CONFIG.ANIMATION_DURATION,
            useNativeDriver: true
          }),
        ]).start();
      });
    } else {
      setSaving(true);
      try {
        const payload = {
          measurementSystem: formData.measurementSystem,
          dietaryPreferences: {
            dietType: formData.diet.toLowerCase(),
            allergies: formData.allergies,
            cuisinePreferences: formData.cuisines,
          },
          healthGoals: {
            goal: formData.goal,
            dailyCalorieTarget: parseInt(formData.calories, 10),
          },
        };
        
        await apiClient.put(ENDPOINTS.AUTH.PROFILE, payload);
        const response = await apiClient.get(ENDPOINTS.AUTH.PROFILE);
        if (response.data?.data?.user) {
          useAuthStore.setState({ user: response.data.data.user });
        }
        completeOnboarding();
      } catch (error) {
        console.error('Failed to save onboarding data:', error);
        completeOnboarding();
      } finally {
        setSaving(false);
      }
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.content}>
            <Text style={[styles.title, { color: COLORS.text }]}>{STRINGS.ONBOARDING.GOAL_TITLE}</Text>
            <Text style={[styles.subtitle, { color: COLORS.textGray }]}>{STRINGS.ONBOARDING.GOAL_SUBTITLE}</Text>
            <View style={styles.goalGrid}>
              {ONBOARDING_GOALS.map((g) => (
                <TouchableOpacity
                  key={g.id}
                  style={[styles.goalCard, formData.goal === g.id && { backgroundColor: COLORS.primary, borderColor: COLORS.primary }]}
                  onPress={() => setFormData({ ...formData, goal: g.id })}
                >
                  <View style={[styles.goalIcon, { backgroundColor: formData.goal === g.id ? COLORS.white : COLORS.inputBg }]}>
                    <Ionicons name={g.icon} size={24} color={formData.goal === g.id ? COLORS.primary : COLORS.textGray} />
                  </View>
                  <Text style={[styles.goalTitle, { color: formData.goal === g.id ? COLORS.white : COLORS.text }]}>{g.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case 1:
        return (
          <View style={styles.content}>
            <Text style={[styles.title, { color: COLORS.text }]}>{STRINGS.ONBOARDING.METRICS_TITLE}</Text>
            <Text style={[styles.subtitle, { color: COLORS.textGray }]}>{STRINGS.ONBOARDING.METRICS_SUBTITLE}</Text>
            
            <View style={styles.inputContainer}>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: COLORS.text }]}>{STRINGS.ONBOARDING.LABEL_WEIGHT}</Text>
                <TextInput
                  style={[styles.textInput, { borderColor: COLORS.border }]}
                  keyboardType="numeric"
                  value={formData.weight}
                  onChangeText={(v) => setFormData({ ...formData, weight: v })}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: COLORS.text }]}>{STRINGS.ONBOARDING.LABEL_HEIGHT}</Text>
                <TextInput
                  style={[styles.textInput, { borderColor: COLORS.border }]}
                  keyboardType="numeric"
                  value={formData.height}
                  onChangeText={(v) => setFormData({ ...formData, height: v })}
                />
              </View>
            </View>

            <Text style={[styles.sectionHeading, { color: COLORS.text }]}>{STRINGS.ONBOARDING.MEASURE_TITLE}</Text>
            <View style={styles.measureOptions}>
              {MEASUREMENT_SYSTEMS.map((m) => (
                <TouchableOpacity
                  key={m.id}
                  style={[styles.measureCard, formData.measurementSystem === m.id && styles.measureCardActive, { borderColor: COLORS.border }]}
                  onPress={() => setFormData({ ...formData, measurementSystem: m.id })}
                >
                  <Text style={styles.measureEmoji}>{m.icon}</Text>
                  <View style={styles.measureInfo}>
                    <Text style={[styles.measureTitle, { color: COLORS.text }]}>{m.title}</Text>
                    <Text style={[styles.measureDesc, { color: COLORS.textGray }]}>{m.desc}</Text>
                  </View>
                  {formData.measurementSystem === m.id && (
                    <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} style={styles.measureCheck} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case 2:
        return (
          <View style={styles.content}>
            <Text style={[styles.title, { color: COLORS.text }]}>{STRINGS.ONBOARDING.DIET_TITLE}</Text>
            <Text style={[styles.subtitle, { color: COLORS.textGray }]}>{STRINGS.ONBOARDING.DIET_SUBTITLE}</Text>
            <View style={styles.dietRow}>
              {DIET_TYPES.map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[styles.dietPill, formData.diet === d && { backgroundColor: COLORS.primary, borderColor: COLORS.primary }]}
                  onPress={() => setFormData({ ...formData, diet: d })}
                >
                  <Text style={[styles.dietPillText, { color: formData.diet === d ? COLORS.white : COLORS.text }]}>{d}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={[styles.inputGroup, { marginTop: 30 }]}>
              <Text style={[styles.inputLabel, { color: COLORS.text }]}>{STRINGS.ONBOARDING.LABEL_CALORIES}</Text>
              <View style={styles.calorieInputWrap}>
                <TextInput
                  style={[styles.calorieInput, { borderColor: COLORS.border, color: COLORS.text }]}
                  keyboardType="numeric"
                  value={formData.calories}
                  onChangeText={(v) => setFormData({ ...formData, calories: v })}
                />
                <Text style={[styles.calorieUnit, { color: COLORS.textGray }]}>kcal/day</Text>
              </View>
              <Text style={[styles.hintText, { color: COLORS.placeholder }]}>{STRINGS.ONBOARDING.CALORIES_HINT}</Text>
            </View>
          </View>
        );
      case 3:
        return (
          <View style={styles.content}>
            <Text style={[styles.title, { color: COLORS.text }]}>{STRINGS.ONBOARDING.ALLERGY_TITLE}</Text>
            <Text style={[styles.subtitle, { color: COLORS.textGray }]}>{STRINGS.ONBOARDING.ALLERGY_SUBTITLE}</Text>
            <View style={styles.tagContainer}>
              {ALLERGY_OPTIONS.map((a) => (
                <TouchableOpacity
                  key={a}
                  style={[styles.tag, formData.allergies.includes(a) && { backgroundColor: '#FFEDED', borderColor: '#FFBABA' }]}
                  onPress={() => toggleSelection(a, 'allergies')}
                >
                  <Ionicons name="warning-outline" size={14} color={formData.allergies.includes(a) ? '#FF5252' : COLORS.textGray} />
                  <Text style={[styles.tagText, { color: formData.allergies.includes(a) ? '#FF5252' : COLORS.text }]}>{a}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case 4:
        return (
          <View style={styles.content}>
            <Text style={[styles.title, { color: COLORS.text }]}>{STRINGS.ONBOARDING.CUISINE_TITLE}</Text>
            <Text style={[styles.subtitle, { color: COLORS.textGray }]}>{STRINGS.ONBOARDING.CUISINE_SUBTITLE}</Text>
            <View style={styles.gridContainer}>
              {CUISINE_OPTIONS.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[styles.cuisineCard, formData.cuisines.includes(c) && { backgroundColor: COLORS.secondary, borderColor: COLORS.primary }]}
                  onPress={() => toggleSelection(c, 'cuisines')}
                >
                  <Text style={[styles.cuisineText, { color: formData.cuisines.includes(c) ? COLORS.primary : COLORS.text }]}>{c}</Text>
                  {formData.cuisines.includes(c) && <Ionicons name="heart" size={16} color={COLORS.primary} />}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case 5:
        return (
          <View style={styles.content}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark-done-circle" size={100} color={COLORS.primary} />
            </View>
            <Text style={[styles.title, { textAlign: 'center', color: COLORS.text }]}>
              {STRINGS.ONBOARDING.SUCCESS_TITLE}, {user?.name}!
            </Text>
            <Text style={[styles.subtitle, { textAlign: 'center', color: COLORS.textGray }]}>
              {STRINGS.ONBOARDING.SUCCESS_SUBTITLE}
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <LinearGradient colors={[COLORS.white, '#F4F7F5']} style={styles.container}>
        <View style={styles.header}>
          <View style={styles.progressContainer}>
            {Array.from({ length: TOTAL_STEPS }).map((_, s) => (
              <View
                key={s}
                style={[
                  styles.progressBar,
                  { backgroundColor: s <= step ? COLORS.primary : COLORS.border, width: (width - 80) / TOTAL_STEPS }
                ]}
              />
            ))}
          </View>
          <Text style={[styles.stepText, { color: COLORS.placeholder }]}>
            {STRINGS.ONBOARDING.STEP_TITLE} {step + 1} {STRINGS.ONBOARDING.OF} {TOTAL_STEPS}
          </Text>
        </View>

        <Animated.View style={[styles.main, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            {renderStep()}
          </ScrollView>
        </Animated.View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.nextBtn} onPress={nextStep} activeOpacity={0.8} disabled={saving}>
            <LinearGradient colors={saving ? [COLORS.border, COLORS.border] : [COLORS.primary, '#7A9467']} style={styles.nextBtnGradient}>
              {saving ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <Text style={styles.nextBtnText}>
                    {step === TOTAL_STEPS - 1 ? STRINGS.ONBOARDING.FINISH_BUTTON : STRINGS.ONBOARDING.NEXT_BUTTON}
                  </Text>
                  <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 25, marginBottom: 20 },
  progressContainer: { flexDirection: 'row', gap: 6, marginBottom: 15 },
  progressBar: { height: 4, borderRadius: 2 },
  stepText: { fontSize: 13, fontWeight: '700' },
  main: { flex: 1, paddingHorizontal: 25 },
  content: { flex: 1 },
  title: { fontSize: 26, fontWeight: '900', marginBottom: 10, letterSpacing: -1 },
  subtitle: { fontSize: 15, lineHeight: 22, marginBottom: 30 },
  sectionHeading: { fontSize: 16, fontWeight: '800', marginTop: 30, marginBottom: 15 },
  
  goalGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15 },
  goalCard: { width: (width - 65) / 2, padding: 20, borderRadius: 24, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#F0F0F0', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10 },
  goalIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  goalTitle: { fontSize: 15, fontWeight: '800' },

  inputContainer: { flexDirection: 'row', gap: 15 },
  inputGroup: { flex: 1, gap: 8 },
  inputLabel: { fontSize: 14, fontWeight: '700', marginLeft: 5 },
  textInput: { height: 60, backgroundColor: '#FFF', borderRadius: 18, paddingHorizontal: 20, fontSize: 18, fontWeight: '700', borderWidth: 1 },
  
  measureOptions: { gap: 12 },
  measureCard: { flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: 20, backgroundColor: '#FFF', borderWidth: 1, gap: 15 },
  measureCardActive: { backgroundColor: '#F0F8EA', borderColor: COLORS.primary },
  measureEmoji: { fontSize: 24 },
  measureInfo: { flex: 1 },
  measureTitle: { fontSize: 16, fontWeight: '700' },
  measureDesc: { fontSize: 12, marginTop: 2 },
  measureCheck: { marginLeft: 10 },

  dietRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  dietPill: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 15, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E0E0E0' },
  dietPillText: { fontSize: 14, fontWeight: '700' },

  calorieInputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 18, borderWidth: 1, paddingHorizontal: 20 },
  calorieInput: { flex: 1, height: 60, fontSize: 22, fontWeight: '800' },
  calorieUnit: { fontSize: 14, fontWeight: '600' },
  hintText: { fontSize: 12, marginTop: 8, marginLeft: 5 },

  tagContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tag: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 12, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E0E0E0', gap: 8 },
  tagText: { fontSize: 14, fontWeight: '700' },

  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  cuisineCard: { width: (width - 70) / 2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, borderRadius: 18, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#F0F0F0' },
  cuisineText: { fontSize: 15, fontWeight: '700' },

  successIcon: { alignItems: 'center', marginTop: 40, marginBottom: 20 },
  footer: { padding: 25, paddingBottom: Platform.OS === 'ios' ? 40 : 25 },
  nextBtn: { borderRadius: 20, overflow: 'hidden' },
  nextBtnGradient: { height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  nextBtnText: { color: '#FFF', fontSize: 18, fontWeight: '800' }
});

export default OnboardingScreen;
