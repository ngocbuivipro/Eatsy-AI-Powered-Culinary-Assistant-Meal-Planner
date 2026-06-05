import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useAuthStore from '../store/useAuthStore';
import apiClient from '../api/client';

// ─── Option Pill (single-select) ─────────────────────────────────────────────
const OptionPill = ({ label, selected, onPress }) => (
  <TouchableOpacity
    style={[styles.pill, selected && styles.pillSelected]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={[styles.pillText, selected && styles.pillTextSelected]}>{label}</Text>
  </TouchableOpacity>
);

// ─── Toggle Tag (multi-select) ────────────────────────────────────────────────
const ToggleTag = ({ label, selected, onPress }) => (
  <TouchableOpacity
    style={[styles.tag, selected && styles.tagSelected]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    {selected && <Ionicons name="checkmark" size={11} color="#526347" style={{ marginRight: 3 }} />}
    <Text style={[styles.tagText, selected && styles.tagTextSelected]}>{label}</Text>
  </TouchableOpacity>
);

// ─── Section ──────────────────────────────────────────────────────────────────
const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

// ─── Data ─────────────────────────────────────────────────────────────────────
const DIET_OPTIONS = [
  { value: 'omnivore', label: 'Omnivore' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'pescatarian', label: 'Pescatarian' },
  { value: 'keto', label: 'Keto' },
  { value: 'paleo', label: 'Paleo' },
];

const GOAL_OPTIONS = [
  { value: 'maintain', label: '⚖️ Maintain Weight' },
  { value: 'lose_weight', label: '📉 Lose Weight' },
  { value: 'gain_muscle', label: '💪 Gain Muscle' },
  { value: 'eat_healthier', label: '🥦 Eat Healthier' },
];

const ALLERGY_OPTIONS = ['Gluten', 'Dairy', 'Nuts', 'Eggs', 'Soy', 'Shellfish', 'Fish'];
const CUISINE_OPTIONS = ['Vietnamese', 'Italian', 'Japanese', 'Chinese', 'Thai', 'Indian', 'Mexican', 'Korean'];

// ─── EditProfileScreen ────────────────────────────────────────────────────────
const EditProfileScreen = ({ navigation }) => {
  const { user, login } = useAuthStore();

  // Local form state — initialised from store
  const [name, setName] = useState(user?.name || '');
  const [dietType, setDietType] = useState(user?.dietaryPreferences?.dietType || 'omnivore');
  const [goal, setGoal] = useState(user?.healthGoals?.goal || 'maintain');
  const [calories, setCalories] = useState(String(user?.healthGoals?.dailyCalorieTarget || 2000));
  const [allergies, setAllergies] = useState(user?.dietaryPreferences?.allergies || []);
  const [cuisine, setCuisine] = useState(user?.dietaryPreferences?.cuisinePreferences || []);
  const [measurementSystem, setMeasurementSystem] = useState(user?.measurementSystem || 'metric');
  const [saving, setSaving] = useState(false);

  const toggleItem = (value, list, setList) => {
    setList(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Missing Name', 'Please enter your name.');
      return;
    }
    const caloriesNum = parseInt(calories, 10);
    if (isNaN(caloriesNum) || caloriesNum < 800 || caloriesNum > 5000) {
      Alert.alert('Invalid Calories', 'Daily calorie target must be between 800 and 5000.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        measurementSystem,
        dietaryPreferences: {
          dietType,
          allergies,
          cuisinePreferences: cuisine,
          dislikedIngredients: user?.dietaryPreferences?.dislikedIngredients || [],
        },
        healthGoals: {
          goal,
          dailyCalorieTarget: caloriesNum,
        },
      };

      const response = await apiClient.put('/users/profile', payload);
      if (response.data?.data?.user) {
        // Update the auth store with the fresh user data
        useAuthStore.setState({ user: response.data.data.user });
      }
      Alert.alert('Saved!', 'Your profile has been updated.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', error?.response?.data?.message || 'Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color="#2B352F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving
            ? <ActivityIndicator size="small" color="#FFF" />
            : <Text style={styles.saveButtonText}>Save</Text>
          }
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Name ── */}
        <Section title="Display Name">
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor="#AAB5AD"
              maxLength={50}
              returnKeyType="done"
            />
          </View>
        </Section>

        {/* ── Diet Type ── */}
        <Section title="Diet Type">
          <View style={styles.pillRow}>
            {DIET_OPTIONS.map(opt => (
              <OptionPill
                key={opt.value}
                label={opt.label}
                selected={dietType === opt.value}
                onPress={() => setDietType(opt.value)}
              />
            ))}
          </View>
        </Section>

        {/* ── Health Goal ── */}
        <Section title="Health Goal">
          <View style={styles.goalList}>
            {GOAL_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.goalRow, goal === opt.value && styles.goalRowSelected]}
                onPress={() => setGoal(opt.value)}
                activeOpacity={0.7}
              >
                <Text style={[styles.goalText, goal === opt.value && styles.goalTextSelected]}>
                  {opt.label}
                </Text>
                {goal === opt.value && (
                  <Ionicons name="checkmark-circle" size={18} color="#526347" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Section>

        {/* ── Daily Calories ── */}
        <Section title="Daily Calorie Target">
          <View style={styles.calorieWrap}>
            <TextInput
              style={styles.calorieInput}
              value={calories}
              onChangeText={setCalories}
              keyboardType="number-pad"
              maxLength={4}
              placeholder="2000"
              placeholderTextColor="#AAB5AD"
            />
            <Text style={styles.calorieUnit}>kcal / day</Text>
          </View>
          <Text style={styles.calorieHint}>Recommended: 1500 – 2500 kcal for most adults</Text>
        </Section>

        {/* ── Measurement System ── */}
        <Section title="Measurement System">
          <View style={styles.measureRow}>
            <TouchableOpacity
              style={[styles.measureCard, measurementSystem === 'metric' && styles.measureCardSelected]}
              onPress={() => setMeasurementSystem('metric')}
              activeOpacity={0.7}
            >
              <Text style={styles.measureIcon}>🌍</Text>
              <Text style={[styles.measureTitle, measurementSystem === 'metric' && styles.measureTitleSelected]}>
                Metric
              </Text>
              <Text style={styles.measureDesc}>kg · g · ml · L · cm</Text>
              {measurementSystem === 'metric' && (
                <View style={styles.measureCheck}>
                  <Ionicons name="checkmark" size={12} color="#FFF" />
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.measureCard, measurementSystem === 'imperial' && styles.measureCardSelected]}
              onPress={() => setMeasurementSystem('imperial')}
              activeOpacity={0.7}
            >
              <Text style={styles.measureIcon}>🇺🇸</Text>
              <Text style={[styles.measureTitle, measurementSystem === 'imperial' && styles.measureTitleSelected]}>
                Imperial
              </Text>
              <Text style={styles.measureDesc}>lb · oz · fl oz · cup</Text>
              {measurementSystem === 'imperial' && (
                <View style={styles.measureCheck}>
                  <Ionicons name="checkmark" size={12} color="#FFF" />
                </View>
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.measureHint}>
            Affects how ingredient quantities are displayed throughout the app.
          </Text>
        </Section>

        {/* ── Allergies ── */}
        <Section title="Allergies & Intolerances">
          <View style={styles.tagRow}>
            {ALLERGY_OPTIONS.map(a => (
              <ToggleTag
                key={a}
                label={a}
                selected={allergies.includes(a)}
                onPress={() => toggleItem(a, allergies, setAllergies)}
              />
            ))}
          </View>
        </Section>

        {/* ── Favourite Cuisines ── */}
        <Section title="Favourite Cuisines">
          <View style={styles.tagRow}>
            {CUISINE_OPTIONS.map(c => (
              <ToggleTag
                key={c}
                label={c}
                selected={cuisine.includes(c)}
                onPress={() => toggleItem(c, cuisine, setCuisine)}
              />
            ))}
          </View>
        </Section>
      </ScrollView>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAF6',
  },

  // Header
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(248,250,246,0.97)',
    borderBottomWidth: 1,
    borderBottomColor: '#E8EDE6',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F0F4EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#2B352F',
    letterSpacing: -0.4,
  },
  saveButton: {
    backgroundColor: '#526347',
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 12,
    minWidth: 70,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#C5D4BF',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },

  // Scroll
  scrollContent: {
    paddingTop: 24,
    paddingBottom: 52,
    paddingHorizontal: 24,
    gap: 28,
  },

  // Section
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#AAB5AD',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginLeft: 2,
  },

  // Name input
  inputWrap: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2EAE3',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  input: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2B352F',
  },

  // Diet pills
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E2EAE3',
  },
  pillSelected: {
    backgroundColor: '#526347',
    borderColor: '#526347',
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#57615B',
  },
  pillTextSelected: {
    color: '#FFF',
  },

  // Health goal list
  goalList: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2EAE3',
    overflow: 'hidden',
  },
  goalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4EE',
  },
  goalRowSelected: {
    backgroundColor: '#F0F8EA',
  },
  goalText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#57615B',
  },
  goalTextSelected: {
    color: '#2B352F',
    fontWeight: '700',
  },

  // Calories
  calorieWrap: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2EAE3',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  calorieInput: {
    fontSize: 26,
    fontWeight: '800',
    color: '#526347',
    letterSpacing: -1,
    minWidth: 80,
  },
  calorieUnit: {
    fontSize: 14,
    fontWeight: '600',
    color: '#AAB5AD',
  },
  calorieHint: {
    fontSize: 11,
    fontWeight: '500',
    color: '#C5D4BF',
    marginLeft: 2,
  },

  // Toggle tags
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E2EAE3',
  },
  tagSelected: {
    backgroundColor: '#EAFED9',
    borderColor: '#A8D08D',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#57615B',
  },
  tagTextSelected: {
    color: '#526347',
  },

  // Measurement system
  measureRow: {
    flexDirection: 'row',
    gap: 12,
  },
  measureCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2EAE3',
    padding: 16,
    alignItems: 'center',
    gap: 4,
    position: 'relative',
  },
  measureCardSelected: {
    borderColor: '#526347',
    backgroundColor: '#F0F8EA',
  },
  measureIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  measureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#57615B',
  },
  measureTitleSelected: {
    color: '#2B352F',
  },
  measureDesc: {
    fontSize: 11,
    fontWeight: '500',
    color: '#AAB5AD',
    textAlign: 'center',
  },
  measureCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#526347',
    alignItems: 'center',
    justifyContent: 'center',
  },
  measureHint: {
    fontSize: 11,
    fontWeight: '500',
    color: '#C5D4BF',
    marginLeft: 2,
  },
});

export default EditProfileScreen;
