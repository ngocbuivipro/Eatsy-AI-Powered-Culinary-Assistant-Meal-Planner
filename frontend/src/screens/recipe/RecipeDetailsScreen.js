// [frontend/src/screens/RecipeDetailsScreen.js]
import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  Platform, 
  ActivityIndicator, 
  StatusBar, 
  Modal, 
  TextInput, 
  KeyboardAvoidingView, 
  Animated, 
  Easing, 
  Keyboard, 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { getHighResImage } from '../utils/imageHelper';
import apiClient from '../api/client';
import { COLORS } from '../constants/Colors';
import { STRINGS } from '../constants/Strings';
import TourTarget from '../components/tour/TourTarget';
import useTourStore from '../store/useTourStore';
import { APP_TOURS } from '../constants/AppConstants';

const { width, height } = Dimensions.get('window');
const HERO_HEIGHT = height * 0.42;
const SHEET_HEIGHT = height * 0.72;

// ─── Typing Indicator (Giữ lại cho AI Chat) ───────────────────────────────────
const TypingDots = () => {
  const d1 = useRef(new Animated.Value(0)).current;
  const d2 = useRef(new Animated.Value(0)).current;
  const d3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = (dot, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: -5, duration: 280, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 280, useNativeDriver: true }),
          Animated.delay(560),
        ])
      ).start();
    anim(d1, 0); anim(d2, 140); anim(d3, 280);
  }, []);

  const dot = (anim) => (
    <Animated.View style={[sheetStyles.dot, { transform: [{ translateY: anim }], backgroundColor: COLORS.primary }]} />
  );
  return (
    <View style={[sheetStyles.aiBubble, { backgroundColor: COLORS.secondary, borderColor: COLORS.border }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, padding: 4 }}>
        {dot(d1)}{dot(d2)}{dot(d3)}
      </View>
    </View>
  );
};

// ─── AI Chat Bottom Sheet (Giữ nguyên) ─────────────────────────────────────
const AIChatSheet = ({ visible, onClose, recipe }) => {
  const slideAnim = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const formatTime = (d) => {
    const h = d.getHours(), m = d.getMinutes().toString().padStart(2, '0');
    return `${h % 12 || 12}:${m} ${h >= 12 ? 'PM' : 'AM'}`;
  };

  useEffect(() => {
    if (visible && recipe) {
      setChatMessages([{
        id: 'init',
        role: 'ai',
        text: `🍽️ I'm viewing **${recipe.title}** with you!\n\nHow can I help you today? You can ask about cooking tips, substitutions, or nutrition!`,
        time: formatTime(new Date()),
      }]);
    }
    if (!visible) {
      setChatMessages([]);
      setChatInput('');
    }
  }, [visible, recipe]);

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0, duration: 340, easing: Easing.out(Easing.quad), useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SHEET_HEIGHT, duration: 260, easing: Easing.in(Easing.quad), useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const scrollToBottom = () => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  useEffect(() => { scrollToBottom(); }, [chatMessages, chatLoading]);

  const sendMessage = async () => {
    const text = chatInput.trim();
    if (!text || chatLoading) return;

    const userMsg = { id: Date.now().toString(), role: 'user', text, time: formatTime(new Date()) };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);
    Keyboard.dismiss();

    try {
      const history = chatMessages
        .filter(m => m.id !== 'init')
        .map(m => ({ role: m.role === 'ai' ? 'model' : 'user', text: m.text }));

      const contextPrefix = chatMessages.filter(m => m.role === 'user').length === 0
        ? `[User is viewing recipe: "${recipe?.title}"] `
        : '';

      const response = await apiClient.post(
        '/ai-assistant/chat',
        { message: contextPrefix + text, history },
        { timeout: 60000 }
      );

      const rawText = response.data?.data || 'Sorry, something went wrong.';
      const cleanText = rawText.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1');
      setChatMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(), role: 'ai', text: cleanText, time: formatTime(new Date()),
      }]);
    } catch (err) {
      setChatMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(), role: 'ai',
        text: STRINGS.AI.ERROR, time: formatTime(new Date()),
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  const quickAsks = [
    '🔄 Substitutions?',
    '⏱️ Speed up time?',
    '💪 Nutrition info?',
  ];

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <TouchableOpacity style={sheetStyles.backdrop} activeOpacity={1} onPress={onClose} />
      <Animated.View style={[sheetStyles.sheet, { backgroundColor: COLORS.background, transform: [{ translateY: slideAnim }] }]}>
        <View style={[sheetStyles.handleBar, { backgroundColor: COLORS.border }]} />
        <View style={[sheetStyles.sheetHeader, { borderBottomColor: COLORS.border }]}>
          <View style={sheetStyles.sheetHeaderLeft}>
            <View style={[sheetStyles.aiIconBadge, { backgroundColor: COLORS.primary }]}>
              <Ionicons name="sparkles" size={12} color={COLORS.white} />
            </View>
            <View>
              <Text style={[sheetStyles.sheetTitle, { color: COLORS.text }]}>Eatsy AI</Text>
              <Text style={[sheetStyles.sheetSubtitle, { color: COLORS.placeholder }]} numberOfLines={1}>
                {recipe?.title}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={[sheetStyles.closeBtn, { backgroundColor: COLORS.secondary }]}>
            <Ionicons name="close" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
        >
          <ScrollView
            ref={scrollRef}
            style={sheetStyles.messageList}
            contentContainerStyle={sheetStyles.messageContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {chatMessages.filter(m => m.role === 'user').length === 0 && (
              <View style={sheetStyles.quickAskRow}>
                {quickAsks.map((q, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[sheetStyles.quickChip, { backgroundColor: COLORS.white, borderColor: COLORS.border }]}
                    onPress={() => { setChatInput(q.replace(/^.\s/, '')); inputRef.current?.focus(); }}
                    activeOpacity={0.7}
                  >
                    <Text style={[sheetStyles.quickChipText, { color: COLORS.text }]}>{q}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {chatMessages.map(msg => (
              <View
                key={msg.id}
                style={msg.role === 'ai' ? sheetStyles.aiRow : sheetStyles.userRow}
              >
                {msg.role === 'ai' && (
                  <View style={sheetStyles.aiLabelRow}>
                    <View style={[sheetStyles.aiIconSmall, { backgroundColor: COLORS.primary }]}>
                      <Ionicons name="sparkles" size={9} color={COLORS.white} />
                    </View>
                    <Text style={[sheetStyles.aiLabel, { color: COLORS.primary }]}>EATSY AI</Text>
                  </View>
                )}
                <View style={[
                  msg.role === 'ai' ? sheetStyles.aiBubble : sheetStyles.userBubble, 
                  msg.role === 'ai' ? { backgroundColor: COLORS.secondary, borderColor: COLORS.border } : { backgroundColor: COLORS.accent }
                ]}>
                  <Text style={[msg.role === 'ai' ? sheetStyles.aiBubbleText : sheetStyles.userBubbleText, { color: COLORS.text }]}>
                    {msg.text}
                  </Text>
                </View>
                <Text style={[sheetStyles.timestamp, { color: COLORS.placeholder }, msg.role === 'user' && { textAlign: 'right' }]}>
                  {msg.time}
                </Text>
              </View>
            ))}

            {chatLoading && (
              <View style={sheetStyles.aiRow}>
                <View style={sheetStyles.aiLabelRow}>
                  <View style={[sheetStyles.aiIconSmall, { backgroundColor: COLORS.primary }]}>
                    <Ionicons name="sparkles" size={9} color={COLORS.white} />
                  </View>
                  <Text style={[sheetStyles.aiLabel, { color: COLORS.primary }]}>EATSY AI</Text>
                </View>
                <TypingDots />
              </View>
            )}
          </ScrollView>

          <View style={[sheetStyles.inputWrapper, { borderTopColor: COLORS.border, backgroundColor: COLORS.background }]}>
            <View style={[sheetStyles.inputBar, { backgroundColor: COLORS.white, borderColor: COLORS.border, shadowColor: COLORS.primary }]}>
              <TextInput
                ref={inputRef}
                style={[sheetStyles.textInput, { color: COLORS.text }]}
                placeholder={STRINGS.AI.INPUT_PLACEHOLDER}
                placeholderTextColor={COLORS.placeholder}
                value={chatInput}
                onChangeText={setChatInput}
                multiline
                maxLength={400}
                returnKeyType="send"
                onSubmitEditing={sendMessage}
                blurOnSubmit={false}
              />
              <TouchableOpacity
                style={[sheetStyles.sendBtn, { backgroundColor: COLORS.primary }, (!chatInput.trim() || chatLoading) && { backgroundColor: COLORS.border }]}
                onPress={sendMessage}
                disabled={!chatInput.trim() || chatLoading}
                activeOpacity={0.8}
              >
                {chatLoading
                  ? <ActivityIndicator size="small" color={COLORS.white} />
                  : <Ionicons name="arrow-up" size={16} color={COLORS.white} />
                }
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </Modal>
  );
};

// ─── Main RecipeDetailsScreen ────────────────────────────────────────────────
const RecipeDetailsScreen = ({ route, navigation }) => {
  const { recipeId } = route.params;
  const [loading, setLoading] = useState(true);
  const [recipe, setRecipe] = useState(null);
  const [sheetVisible, setSheetVisible] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const mainScrollRef = useRef(null);
  const { startTour } = useTourStore();
  
  // Toạ độ các phần để tự động cuộn
  const [ingredientsY, setIngredientsY] = useState(0);
  const [instructionsY, setInstructionsY] = useState(0);

  useEffect(() => { 
    fetchDetails(); 
  }, [recipeId]);

  // Kích hoạt tour sau khi dữ liệu đã load xong
  useEffect(() => {
    if (!loading && recipe) {
      const timer = setTimeout(() => {
        startTour('recipe_details', APP_TOURS.RECIPE);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [loading, recipe]);

  const handleScrollToIngredients = () => {
    if (ingredientsY > 0) {
      mainScrollRef.current?.scrollTo({ y: ingredientsY - 40, animated: true });
    }
  };

  const handleScrollToInstructions = () => {
    if (instructionsY > 0) {
      mainScrollRef.current?.scrollTo({ y: instructionsY - 40, animated: true });
    }
  };

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/recipes/${recipeId}/details`);
      if (response.data.status === 'success') {
        setRecipe(response.data.data.recipe);
      }
    } catch (error) {
      console.error('Error fetching recipe details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: COLORS.background }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!recipe) return null;

  const calories = recipe.nutrition?.nutrients?.find(n => n.name === 'Calories')?.amount || 420;

  // Header Animation logic
  const imageScale = scrollY.interpolate({
    inputRange: [-HERO_HEIGHT, 0],
    outputRange: [2, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* ── Header Controls (Sticky) ── */}
      <View style={styles.headerControls}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconWrapper}>
          <BlurView intensity={25} style={styles.blurCircle}>
            <Ionicons name="chevron-back" size={24} color={COLORS.white} />
          </BlurView>
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconWrapper}>
            <BlurView intensity={25} style={styles.blurCircle}>
              <Ionicons name="share-outline" size={20} color={COLORS.white} />
            </BlurView>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconWrapper}>
            <BlurView intensity={25} style={styles.blurCircle}>
              <Ionicons name="heart-outline" size={20} color={COLORS.white} />
            </BlurView>
          </TouchableOpacity>
        </View>
      </View>

      <Animated.ScrollView 
        ref={mainScrollRef}
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* ── Hero Image Section ── */}
        <Animated.View style={[styles.heroSection, { transform: [{ scale: imageScale }] }]}>
          <Image 
            source={{ uri: getHighResImage(recipe.image || recipe.imageUrl) }} 
            style={styles.heroImage} 
            resizeMode="cover"
          />
          <LinearGradient 
            colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.6)']} 
            style={StyleSheet.absoluteFill} 
          />
        </Animated.View>

        {/* ── Content Container (Overlapping) ── */}
        <View style={[styles.content, { backgroundColor: COLORS.background }]}>
          
          {/* Header Info (Khôi phục kiểu cũ) */}
          <View style={styles.headerInfoOld}>
            <View style={[styles.chefTag, { backgroundColor: COLORS.primary }]}>
              <Text style={[styles.chefTagText, { color: COLORS.accent }]}>{STRINGS.RECIPE.CHEF_CHOICE}</Text>
            </View>
            <Text style={[styles.title, { color: COLORS.text }]}>{recipe.title}</Text>
          </View>

          {/* Stats Bar (Khôi phục kiểu cũ có divider) */}
          <TourTarget tourKey="recipe_stats">
            <View style={[styles.statsBar, { backgroundColor: COLORS.white, shadowColor: '#000' }]}>
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={18} color={COLORS.primary} />
                <Text style={[styles.statLabel, { color: COLORS.placeholder }]}>{STRINGS.RECIPE.PREP_TIME}</Text>
                <Text style={[styles.statValue, { color: COLORS.text }]}>{recipe.prepTime || recipe.readyInMinutes} min</Text>
              </View>
              <View style={[styles.verticalDivider, { backgroundColor: COLORS.border } ]} />
              <View style={styles.statItem}>
                <Ionicons name="bar-chart-outline" size={18} color={COLORS.primary} />
                <Text style={[styles.statLabel, { color: COLORS.placeholder }]}>{STRINGS.RECIPE.DIFFICULTY}</Text>
                <Text style={[styles.statValue, { color: COLORS.text }]}>{recipe.difficulty || "Easy"}</Text>
              </View>
              <View style={[styles.verticalDivider, { backgroundColor: COLORS.border }]} />
              <View style={styles.statItem}>
                <Ionicons name="flame-outline" size={18} color={COLORS.primary} />
                <Text style={[styles.statLabel, { color: COLORS.placeholder }]}>{STRINGS.RECIPE.CALORIES}</Text>
                <Text style={[styles.statValue, { color: COLORS.text }]}>{Math.round(calories)} kcal</Text>
              </View>
            </View>
          </TourTarget>

          {/* Description & Health Note (Khôi phục kiểu cũ) */}
          <View style={styles.oldSectionHeader}>
            <Text style={[styles.sectionTitle, { color: COLORS.text }]}>{STRINGS.RECIPE.THE_PROFILE}</Text>
          </View>
          <Text style={[styles.description, { color: COLORS.textGray }]}>
            "{recipe.description?.replace(/<[^>]*>?/gm, '') || "A delicious meal prepared with fresh ingredients and love."}"
          </Text>

          <View style={[styles.healthNote, { backgroundColor: COLORS.inputBg }]}>
            <View style={styles.healthNoteHeader}>
              <Ionicons name="leaf-outline" size={16} color={COLORS.primary} />
              <Text style={[styles.healthNoteTitle, { color: COLORS.primary }]}>{STRINGS.RECIPE.HEALTH_NOTE}</Text>
            </View>
            <Text style={[styles.healthNoteText, { color: COLORS.textGray }]}>
              Rich in essential nutrients and fiber. Perfect for a balanced and energizing meal.
            </Text>
          </View>

          {/* Ingredients (Khôi phục kiểu cũ) */}
          <View 
            onLayout={(e) => setIngredientsY(e.nativeEvent.layout.y)}
          >
            <TourTarget tourKey="recipe_ingredients" onActive={handleScrollToIngredients}>
              <View style={styles.oldSectionHeaderRow}>
                <Text style={[styles.sectionTitle, { color: COLORS.text }]}>{STRINGS.RECIPE.INGREDIENTS}</Text>
                <Text style={[styles.servingText, { color: COLORS.placeholder }]}>{recipe.servings} {STRINGS.RECIPE.SERVINGS}</Text>
              </View>
              <View style={styles.ingredientsList}>
                {(recipe.ingredients || []).map((ing, idx) => (
                  <View key={`ing-${ing.id || idx}`} style={[styles.ingredientItem, { borderBottomColor: COLORS.border }]}>
                    <View style={styles.ingredientLeft}>
                      <View style={[styles.dot, { backgroundColor: COLORS.primary }]} />
                      <Text style={[styles.ingredientName, { color: COLORS.text }]}>{ing.originalName || ing.name}</Text>
                    </View>
                    <Text style={[styles.ingredientAmount, { color: COLORS.primary }]}>
                      {Math.round(ing.amount)} {ing.unit}
                    </Text>
                  </View>
                ))}
              </View>
            </TourTarget>
          </View>

          {/* Instructions (Khôi phục kiểu cũ với connector) */}
          <View 
            onLayout={(e) => setInstructionsY(e.nativeEvent.layout.y)}
          >
            <TourTarget tourKey="recipe_instructions" onActive={handleScrollToInstructions}>
              <View style={styles.oldSectionHeaderRow}>
                <Text style={[styles.sectionTitle, { color: COLORS.text }]}>{STRINGS.RECIPE.INSTRUCTIONS}</Text>
                <View style={[styles.instructionLine, { backgroundColor: COLORS.primary }]} />
              </View>
              <View style={styles.instructionsList}>
                {(recipe.steps || []).map((step, idx) => (
                  <View key={`step-${step.number || idx}`} style={styles.stepItem}>
                    <View style={styles.stepNumberContainer}>
                      <View style={[styles.stepNumber, { backgroundColor: COLORS.white, borderColor: COLORS.border }, idx === 0 && { backgroundColor: COLORS.primary, borderColor: COLORS.primary }]}>
                        <Text style={[styles.stepNumberText, { color: COLORS.placeholder }, idx === 0 && { color: COLORS.white }]}>
                          {step.number}
                        </Text>
                      </View>
                      {idx < (recipe.steps || []).length - 1 && (
                        <View style={[styles.stepConnector, { backgroundColor: COLORS.border }]} />
                      )}
                    </View>
                    <View style={styles.stepContent}>
                      <Text style={[styles.stepTitle, { color: COLORS.text }]}>{STRINGS.RECIPE.STEP} {step.number}</Text>
                      <Text style={[styles.stepDescription, { color: COLORS.textGray }]}>{step.step}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </TourTarget>
          </View>
        </View>
      </Animated.ScrollView>

      {/* AI Assistant Button */}
      <View style={styles.floatingAction}>
        <TourTarget tourKey="recipe_ai">
          <TouchableOpacity 
            style={[styles.aiButton, { backgroundColor: 'rgba(255,255,255,0.92)', borderColor: 'rgba(82,99,71,0.15)' }]} 
            activeOpacity={0.9} 
            onPress={() => setSheetVisible(true)}
          >
            <View style={styles.aiButtonContent}>
              <View style={[styles.aiIndicator, { backgroundColor: COLORS.primary }]} />
              <Text style={[styles.aiButtonText, { color: COLORS.textGray }]}>{STRINGS.RECIPE.ASK_AI_BUTTON}</Text>
            </View>
            <Ionicons name="sparkles-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </TourTarget>
      </View>

      <AIChatSheet visible={sheetVisible} onClose={() => setSheetVisible(false)} recipe={recipe} />
    </View>
  );
};

// Styles (Merge Header mới với Content cũ)
const sheetStyles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet: { position: 'absolute', bottom: 0, left: 0, right: 0, height: SHEET_HEIGHT, borderTopLeftRadius: 28, borderTopRightRadius: 28, shadowColor: '#000', shadowOffset: { width: 0, height: -6 }, shadowOpacity: 0.12, shadowRadius: 20, elevation: 20 },
  handleBar: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 4 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1 },
  sheetHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  aiIconBadge: { width: 32, height: 32, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  sheetTitle: { fontSize: 15, fontWeight: '800', letterSpacing: -0.3 },
  sheetSubtitle: { fontSize: 11, fontWeight: '500', maxWidth: width - 120 },
  closeBtn: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  messageList: { flex: 1 },
  messageContent: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10, gap: 14 },
  quickAskRow: { gap: 8, marginBottom: 4 },
  quickChip: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9 },
  quickChipText: { fontSize: 13, fontWeight: '500' },
  aiRow: { alignSelf: 'flex-start', maxWidth: width * 0.80, gap: 4 },
  userRow: { alignSelf: 'flex-end', maxWidth: width * 0.75, gap: 4 },
  aiLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 2 },
  aiIconSmall: { width: 16, height: 16, borderRadius: 5, alignItems: 'center', justifyContent: 'center' },
  aiLabel: { fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  aiBubble: { borderWidth: 1, borderRadius: 0, borderTopLeftRadius: 0, borderTopRightRadius: 16, borderBottomLeftRadius: 16, borderBottomRightRadius: 16, paddingHorizontal: 14, paddingVertical: 10 },
  aiBubbleText: { fontSize: 13, lineHeight: 20 },
  userBubble: { borderRadius: 16, borderTopRightRadius: 0, paddingHorizontal: 14, paddingVertical: 10 },
  userBubbleText: { fontSize: 13, lineHeight: 20 },
  timestamp: { fontSize: 9, fontWeight: '600', paddingHorizontal: 3 },
  dot: { width: 6, height: 6, borderRadius: 3, marginHorizontal: 2 },
  inputWrapper: { paddingHorizontal: 14, paddingTop: 10, paddingBottom: Platform.OS === 'ios' ? 28 : 16, borderTopWidth: 1 },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', borderRadius: 16, borderWidth: 1, paddingLeft: 14, paddingRight: 6, paddingVertical: 6, gap: 8, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  textInput: { flex: 1, fontSize: 13, lineHeight: 20, maxHeight: 80, paddingTop: 4, paddingBottom: 4 },
  sendBtn: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-end' },
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingBottom: 120 },
  heroSection: { height: HERO_HEIGHT, width: width, backgroundColor: '#000', overflow: 'hidden' },
  heroImage: { width: '100%', height: '100%' },
  headerControls: { position: 'absolute', top: Platform.OS === 'ios' ? 50 : 30, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between', zIndex: 100 },
  headerRight: { flexDirection: 'row', gap: 8 },
  iconWrapper: { overflow: 'hidden', borderRadius: 20 },
  blurCircle: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  content: { marginTop: -40, borderTopLeftRadius: 40, borderTopRightRadius: 40, paddingHorizontal: 24, paddingTop: 32, paddingBottom: 40 },
  
  // Header Info Kiểu cũ
  headerInfoOld: { marginBottom: 20 },
  chefTag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginBottom: 12, alignSelf: 'flex-start' },
  chefTagText: { fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  title: { fontSize: 32, fontWeight: '800', letterSpacing: -1 },

  // Stats bar kiểu cũ có vạch kẻ
  statsBar: { flexDirection: 'row', borderRadius: 24, paddingVertical: 20, paddingHorizontal: 10, marginBottom: 32, elevation: 2, alignItems: 'center', justifyContent: 'space-around', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10 },
  statItem: { alignItems: 'center', flex: 1 },
  statLabel: { fontSize: 9, fontWeight: '800', marginTop: 4, letterSpacing: 0.5 },
  statValue: { fontSize: 14, fontWeight: '700', marginTop: 2 },
  verticalDivider: { width: 1, height: 30 },

  // Description & Health Note kiểu cũ
  oldSectionHeader: { marginBottom: 12 },
  sectionTitle: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  description: { fontSize: 15, lineHeight: 24, marginBottom: 24 },
  healthNote: { borderRadius: 20, padding: 20, marginBottom: 40 },
  healthNoteHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  healthNoteTitle: { fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  healthNoteText: { fontSize: 14, lineHeight: 20 },

  // Ingredients kiểu cũ
  oldSectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  servingText: { fontSize: 14, fontWeight: '600' },
  ingredientsList: { marginBottom: 40 },
  ingredientItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1 },
  ingredientLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  ingredientName: { fontSize: 15, fontWeight: '600', flex: 1 },
  ingredientAmount: { fontSize: 14, fontWeight: '700' },

  // Instructions kiểu cũ có connector
  instructionLine: { width: 40, height: 3, borderRadius: 2 },
  instructionsList: { paddingTop: 10 },
  stepItem: { flexDirection: 'row', gap: 20, marginBottom: 32 },
  stepNumberContainer: { alignItems: 'center' },
  stepNumber: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  stepNumberText: { fontSize: 14, fontWeight: '700' },
  stepConnector: { width: 2, flex: 1, marginVertical: 4 },
  stepContent: { flex: 1, paddingTop: 4 },
  stepTitle: { fontSize: 17, fontWeight: '800', marginBottom: 6 },
  stepDescription: { fontSize: 14, lineHeight: 22 },

  // AI Button Container
  floatingAction: { position: 'absolute', bottom: 40, left: 24, right: 24 },
  aiButton: { height: 60, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, borderWidth: 1, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 8 },
  aiButtonContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  aiIndicator: { width: 8, height: 8, borderRadius: 4 },
  aiButtonText: { fontSize: 14, fontWeight: '600' },
});

export default RecipeDetailsScreen;
